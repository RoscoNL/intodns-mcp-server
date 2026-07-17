import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

async function startServer(port) {
  const child = spawn(process.execPath, ["dist/index.js", "--http", String(port)], {
    cwd: new URL("..", import.meta.url),
    stdio: ["ignore", "ignore", "pipe"],
  });
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) return child;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
  child.kill("SIGTERM");
  throw new Error("HTTP MCP server did not start");
}

async function stopServer(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await once(child, "close");
}

test("serves all tools to an official native MCP client", async () => {
  const port = 30_000 + Math.floor(Math.random() * 1_000);
  const child = await startServer(port);
  const client = new Client({ name: "http-test", version: "1" });
  const transport = new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${port}/mcp`));
  try {
    await client.connect(transport);
    const result = await client.listTools();
    assert.equal(result.tools.length, 42);
    assert.equal(result.tools.filter((tool) => tool.annotations).length, 42);
  } finally {
    await transport.close().catch(() => undefined);
    await stopServer(child);
  }
});

test("rejects untrusted browser origins", async () => {
  const port = 31_000 + Math.floor(Math.random() * 1_000);
  const child = await startServer(port);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/mcp`, {
      method: "POST",
      headers: {
        Origin: "https://attacker.example",
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-11-25",
          capabilities: {},
          clientInfo: { name: "http-test", version: "1" },
        },
      }),
    });
    assert.equal(response.status, 403);
  } finally {
    await stopServer(child);
  }
});

test("rejects oversized JSON requests", async () => {
  const port = 32_000 + Math.floor(Math.random() * 1_000);
  const child = await startServer(port);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ padding: "x".repeat(1_100_000) }),
    });
    assert.equal(response.status, 413);
  } finally {
    await stopServer(child);
  }
});
