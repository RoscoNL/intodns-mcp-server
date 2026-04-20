# IntoDNS MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that gives AI assistants (Claude, Cursor, Windsurf, etc.) direct access to [IntoDNS.ai](https://intodns.ai) DNS and email security scanning.

Ask your AI: *"Check the DNS security of example.com"* and it will run a live scan, grade the domain, and explain the findings — no copy-pasting, no tab switching.

## Tools

| Tool | What it does |
|------|-------------|
| `scan_domain` | Full DNS & email security scan — grade (A+ to F), score, 50+ checks |
| `check_email_security` | SPF, DKIM, DMARC validation + blacklist status |
| `lookup_dns` | DNS record lookup (A, AAAA, MX, TXT, NS, CNAME, SOA, CAA, SRV) |
| `check_dns_propagation` | Global propagation check across multiple resolvers |
| `validate_dnssec` | DNSSEC signing, key chain, and DS record validation |

Free to use. No API key required. Powered by [IntoDNS.ai](https://intodns.ai).

## Quick Start (Claude Desktop)

### Option A — npx (no install)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "intodns": {
      "command": "npx",
      "args": ["-y", "@intodns/mcp-server"]
    }
  }
}
```

### Option B — global install

```bash
npm install -g @intodns/mcp-server
```

Then in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "intodns": {
      "command": "intodns-mcp"
    }
  }
}
```

Restart Claude Desktop after editing the config.

## Usage with Claude

Once connected, you can ask Claude things like:

- *"Scan example.com and tell me what's wrong with their email security"*
- *"Does example.com have DMARC configured correctly?"*
- *"Look up the MX records for example.com"*
- *"Has my SPF change propagated globally yet?"*
- *"Check if example.com is on any email blacklists"*

## Other MCP clients

Works with any MCP-compatible client (Cursor, Windsurf, Continue, etc.). Use the same `command` / `args` format from the config above.

## Requirements

- Node.js 18+
- Internet access to reach `intodns.ai`

## License

MIT — built by [Cobytes B.V.](https://cobytes.com)
