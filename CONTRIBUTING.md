# Contributing

## Where this code is edited

This repository is a publish mirror. `src/` is edited in the IntoDNS monorepo
under `mcp/`, where the same package is an npm workspace and the site's
`/api/mcp` route imports it directly — so a tool change and its deployment are
one commit. Pull requests here are welcome; they are applied upstream and land
back on the next release push.


## Tool description template

Every `server.tool()` description in `src/server.ts` MUST cover the six Glama TDQS dimensions or it will lower the listing's score (and worse, leave agents guessing about when to call the tool).

### Required structure

```
[Verb] [resource] [from where]. [Method + idempotency + side effects].
Returns [output shape]. [Prerequisites or required prior calls].
Use when [trigger]; use [alternative tool] instead when [diff]. [Auth / no-auth].
```

### The six dimensions

1. **Behavior** — state read/write, side effects, auth needs, rate limits, destructive flags. Default sentence: "Read-only HTTP GET via IntoDNS.ai public API, no auth, no destructive actions."
2. **Conciseness** — 50-120 words. Front-load the verb + resource. No filler.
3. **Completeness** — enough for a first-call success. If complex, mention output shape; if simple, say so.
4. **Parameters** — explain intent beyond schema. Defaults, valid ranges, mutual exclusivity, when to use `domain` vs `ip`, etc.
5. **Purpose** — one specific verb + resource. Differentiate from sibling tools by name.
6. **Usage Guidelines** — when to use, when not to, what the alternative tool is. Mention prerequisites (e.g. `requires testId from create_email_test`).

### Good example

```ts
server.tool(
  "check_dmarc",
  "Read-only fetch and parse of the _dmarc TXT record. Returns parsed tag map (p, sp, rua, ruf, adkim, aspf, pct, fo), policy strength assessment, alignment mode, and warnings (missing rua, p=none, weak alignment, multiple records). Use for DMARC policy review; use check_sender_requirements for combined Google/Yahoo SPF+DKIM+DMARC pass/fail verdict. Single GET, no auth, no side effects.",
  { domain: domainSchema },
  async ({ domain }) => jsonResponse(await apiGet("/email/dmarc", { domain }))
);
```

### Bad example

```ts
// Misses: side effects, parameter intent, when to use, alternatives, output shape
server.tool(
  "check_dmarc",
  "Parse and validate DMARC policy for a domain.",
  { domain: domainSchema },
  ...
);
```

## Pre-publish checklist

Run before every release:

```bash
npm test             # Description lint, TypeScript build, catalog and HTTP tests
```

`lint:tools` will fail the build if any tool has a description shorter than 200 characters or missing usage guidance markers (`use`, `instead`, `after`).
