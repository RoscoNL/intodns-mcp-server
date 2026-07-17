import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "intodns-live-smoke", version: "1" });
const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["dist/index.js"],
  cwd: new URL("..", import.meta.url).pathname,
  stderr: "pipe",
});

try {
  await client.connect(transport);
  const catalog = await client.listTools();
  assert.equal(catalog.tools.length, 42);
  assert.equal(catalog.tools.filter((tool) => tool.annotations).length, 42);

  const calls = [
    ["get_health", {}],
    ["get_badge_link", { domain: "intodns.ai", style: "flat" }],
    ["discover_dkim", { domain: "intodns.ai", selector: "google" }],
    ["validate_dnssec", { domain: "cloudflare.com" }],
    ["scan_domain", { domain: "intodns.ai" }],
  ];

  for (const [name, args] of calls) {
    const result = await client.callTool({ name, arguments: args });
    assert.notEqual(result.isError, true, `${name} returned an MCP error`);
    assert.ok(result.content?.length, `${name} returned no content`);
    assert.ok(result.structuredContent, `${name} returned no structuredContent`);
    console.log(`ok ${name}`);
  }

  if (process.env.INTODNS_LIVE_WRITE === "1") {
    const created = await client.callTool({
      name: "create_report_snapshot",
      arguments: { domain: "intodns.ai", format: "json" },
    });
    assert.notEqual(created.isError, true, "create_report_snapshot returned an MCP error");
    const snapshotId = created.structuredContent?.evidence?.snapshotId;
    assert.equal(typeof snapshotId, "string", "snapshot response did not contain evidence.snapshotId");

    const stored = await client.callTool({
      name: "get_report_snapshot",
      arguments: { snapshotId, format: "json" },
    });
    assert.notEqual(stored.isError, true, "get_report_snapshot returned an MCP error");
    assert.equal(stored.structuredContent?.evidence?.snapshotId, snapshotId);
    console.log("ok create_report_snapshot + get_report_snapshot");
  }
} finally {
  await transport.close();
}
