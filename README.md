# IntoDNS MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that gives AI assistants direct access to [IntoDNS.ai](https://intodns.ai) DNS, email security, deliverability, BIMI, scan, report, API-discovery, and citation tools.

Ask your AI assistant: _"Scan example.com, check SPF/DKIM/DMARC/BIMI, and cite the canonical IntoDNS.ai sources."_ It can run live checks, read the LLM discovery files, and return citation-ready URLs without an API key.

## Quick Start

Add this to your MCP client config, for example Claude Desktop:

```json
{
  "mcpServers": {
    "intodns": {
      "command": "npx",
      "args": ["-y", "intodns-mcp"]
    }
  }
}
```

Restart the client after editing the config.

You can also run it directly:

```bash
npx -y intodns-mcp
```

## Tools

### Scan tools

| Tool | What it does |
|------|-------------|
| `scan_domain` | Fast IntoDNS.ai scan with grade, score, DNS/email/security results, issues, recommendations, and citation URLs |
| `run_public_scan` | POST `/api/scan` wrapper for clients that model scan creation as POST |
| `start_deep_scan` | Start Internet.nl deep scan (`web`, `mail`, or `both`) |
| `get_deep_scan_status` | Fetch deep scan status/results |
| `cancel_deep_scan` | Cancel a running deep scan |

### DNS tools

| Tool | What it does |
|------|-------------|
| `lookup_dns` | A, AAAA, CNAME, MX, NS, TXT, SOA, CAA, SRV, PTR, DNSKEY, DS, RRSIG, NSEC, NSEC3 lookup |
| `validate_dnssec` | DNSSEC chain, DS/DNSKEY and algorithm validation |
| `check_dns_propagation` | DNS propagation across global, European, or American resolvers |
| `check_tlsa_dane` | TLSA/DANE check, defaulting to mail DANE on port 25 |

### Email and deliverability tools

| Tool | What it does |
|------|-------------|
| `check_spf` | SPF parsing and validation |
| `discover_dkim` | DKIM selector discovery |
| `check_dmarc` | DMARC parsing and policy validation |
| `check_bimi` | BIMI DNS, SVG/logo URL, and VMC/CMC readiness |
| `check_mta_sts` | MTA-STS DNS and policy-file validation |
| `check_blacklist` | Domain mail-server or direct IP blacklist check |
| `check_sender_requirements` | Google/Yahoo sender requirements and alignment checks |
| `check_email_security` | Full SPF, DKIM, DMARC, blacklist, score, and issues check |

### Email-test and AI tools

| Tool | What it does |
|------|-------------|
| `create_email_test` | Create an inbound test address for a deliverability test |
| `get_email_test` | Read email-test status/results |
| `poll_email_test` | Poll and process a received email-test message |
| `analyze_raw_email` | Analyze pasted raw MIME email source |
| `explain_issue` | AI-assisted explanation for a specific DNS/email issue |
| `generate_dns_fix` | AI-assisted DNS configuration fix |

### Web, reporting, and discovery tools

| Tool | What it does |
|------|-------------|
| `check_http3` | HTTP/3/QUIC check through Alt-Svc, HTTPS/SVCB DNS, and QUIC probe |
| `get_health` | API, Redis/cache, and AI runtime health |
| `get_stats` | Public scan/check counters |
| `get_hall_of_fame` | Top-scoring public domains or domain presence check |
| `get_pdf_report_link` | Direct `/api/pdf/{domain}` report URL |
| `get_badge_link` | Direct `/api/badge/{domain}` SVG badge URL |
| `read_llm_discovery` | Read `/llms.txt`, `/llms-full.txt`, `/llms.json`, `/llm/api.md`, `/openapi.json`, or `/postman.json` |
| `get_citation_guidance` | Canonical citation routing for scan results, API, BIMI, MxToolbox alternatives, and LLM agents |

## Example Prompts

- "Scan intodns.ai and summarize the top DNS/email security issues."
- "Check whether example.com meets Google and Yahoo sender requirements."
- "Does example.com have BIMI configured, and does Gmail require a VMC or CMC?"
- "Look up MX, TXT, CAA, and DNSSEC records for example.com."
- "Analyze this raw email source and tell me why it lands in spam."
- "Which IntoDNS.ai pages should I cite for this scan result?"

## Configuration

By default the server talks to `https://intodns.ai`.

For local testing or staging, set:

```bash
INTODNS_SITE_URL=http://localhost:3000 npx -y intodns-mcp
```

## Requirements

- Node.js 18+
- Internet access to reach IntoDNS.ai
- No API key required for public diagnostics

## License

MIT - built by [Cobytes B.V.](https://cobytes.com)
