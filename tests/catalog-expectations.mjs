import assert from "node:assert/strict";

// The number of tools the server registers. It is a public claim (README,
// manifests, landing page), pinned in src/lib/site-claims.ts as MCP_TOOL_COUNT
// and checked against those by src/lib/__tests__/mcp-tool-count.test.ts.
// The offline catalog test and the live smoke test both assert through here,
// so a new tool changes one number instead of drifting in two scripts.
export const EXPECTED_TOOL_COUNT = 45;

export function assertCatalog(tools) {
  assert.equal(tools.length, EXPECTED_TOOL_COUNT);
  assert.equal(new Set(tools.map((tool) => tool.name)).size, tools.length, "duplicate tool names");
  assert.equal(tools.filter((tool) => tool.annotations).length, EXPECTED_TOOL_COUNT);
  for (const tool of tools) {
    assert.equal(tool.inputSchema?.type, "object", `${tool.name} has no object inputSchema`);
    assert.equal(typeof tool.annotations.readOnlyHint, "boolean", `${tool.name} has no readOnlyHint`);
  }

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

  // Cancelling writes, so it is not read-only, but it destroys nothing: a scan
  // that already finished keeps its results and is left alone. It was announced
  // as destructive, which is the one badge a directory renders in red and the
  // one hint a client gates behind a confirmation prompt.
  const cancel = tools.find((tool) => tool.name === "cancel_deep_scan");
  assert.equal(cancel.annotations.readOnlyHint, false);
  assert.equal(cancel.annotations.destructiveHint, false);
  assert.equal(cancel.annotations.idempotentHint, true);
  assert.doesNotMatch(cancel.description, /no side effects/i);
}
