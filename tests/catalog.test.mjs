import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { VERSION } from "../dist/server.js";

test("runtime version matches the published package version", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(VERSION, packageJson.version);
});

async function inspectServer() {
  const child = spawn(process.execPath, ["dist/index.js"], {
    cwd: new URL("..", import.meta.url),
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stdout = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });

  child.stdin.write(`${JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-11-25",
      capabilities: {},
      clientInfo: { name: "catalog-test", version: "1" },
    },
  })}\n`);
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`);
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" })}\n`);
  child.stdin.write(`${JSON.stringify({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: { name: "get_badge_link", arguments: { domain: "example.com", style: "flat" } },
  })}\n`);

  const deadline = Date.now() + 5_000;
  while (!stdout.split("\n").some((line) => line.includes('"id":3')) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  child.stdin.end();
  await once(child, "close");

  const messages = stdout
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  const listResponse = messages.find((message) => message.id === 2);
  const callResponse = messages.find((message) => message.id === 3);
  assert.ok(listResponse?.result?.tools, `tools/list response missing: ${stdout}`);
  assert.ok(callResponse?.result, `tools/call response missing: ${stdout}`);
  return { tools: listResponse.result.tools, callResult: callResponse.result };
}

test("publishes a truthful, annotated MCP catalog", async () => {
  const { tools, callResult } = await inspectServer();
  assert.equal(tools.length, 45);
  assert.equal(tools.filter((tool) => tool.annotations).length, 45);

  const discoverDkim = tools.find((tool) => tool.name === "discover_dkim");
  assert.ok(discoverDkim.inputSchema.properties.selector);
  assert.doesNotMatch(discoverDkim.description, /150 common selectors/i);

  const explainIssue = tools.find((tool) => tool.name === "explain_issue");
  assert.ok(explainIssue.inputSchema.properties.issue.enum.includes("dnssec_invalid"));
  assert.ok(explainIssue.inputSchema.properties.issue.enum.includes("no_ipv6_mail"));

  const snapshot = tools.find((tool) => tool.name === "create_report_snapshot");
  assert.equal(snapshot.annotations.readOnlyHint, false);
  assert.equal(snapshot.annotations.destructiveHint, false);
  assert.equal(snapshot.annotations.idempotentHint, false);

  const cancel = tools.find((tool) => tool.name === "cancel_deep_scan");
  assert.equal(cancel.annotations.destructiveHint, true);
  assert.equal(cancel.annotations.idempotentHint, true);

  assert.equal(callResult.structuredContent.domain, "example.com");
  assert.match(callResult.content[0].text, /example\.com/);
});
