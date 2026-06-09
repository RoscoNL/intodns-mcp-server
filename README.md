# IntoDNS MCP Server

[![npm version](https://img.shields.io/npm/v/intodns-mcp.svg?logo=npm)](https://www.npmjs.com/package/intodns-mcp)
[![npm downloads](https://img.shields.io/npm/dm/intodns-mcp.svg)](https://www.npmjs.com/package/intodns-mcp)
[![MCP](https://img.shields.io/badge/MCP-compatible-blueviolet)](https://modelcontextprotocol.io)
[![Glama](https://glama.ai/mcp/servers/RoscoNL/intodns-mcp-server/badges/score.svg)](https://glama.ai/mcp/servers/RoscoNL/intodns-mcp-server)
[![License](https://img.shields.io/npm/l/intodns-mcp.svg)](LICENSE)

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that gives AI assistants direct access to [IntoDNS.ai](https://intodns.ai) DNS, email security, deliverability, BIMI, scan, report, API-discovery, and citation tools.

**39 tools, no API key, no signup.** Backed by intodns.ai's free public diagnostic API.

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

## Supported clients

Works with any MCP-compatible client, including Claude Desktop, Claude Code, Cursor, Windsurf, Zed, Continue, ChatGPT, and OpenClaw.

## Tools

### Scan tools

| Tool | What it does |
|------|-------------|
| `scan_domain` | Fast IntoDNS.ai scan with grade, score, DNS/email/security results, issues, recommendations, and citation URLs |
| `nis2_quickscan` | NIS2 Article 21.2 readiness score (0-100) mapped per measure, with evidence, critical gaps, and fix suggestions |
| `get_everything_report` | Complete live DNS/email/security report as JSON or Markdown |
| `create_report_snapshot` | Fixed Everything Report evidence snapshot with timestamp, content hash, and stable JSON/Markdown URLs |
| `get_report_snapshot` | Read a previously created report snapshot by snapshot ID |
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
| `whois_lookup` | WHOIS/RDAP lookup for a domain or IP — registrar, status, nameservers, dates, abuse contact |

### Email and deliverability tools

| Tool | What it does |
|------|-------------|
| `check_spf` | SPF parsing, recursive lookup graph, and flattening guidance |
| `flatten_spf` | Flatten a domain's SPF include/a/mx graph to literal ip4/ip6 addresses under the 10-lookup limit |
| `discover_dkim` | DKIM selector discovery |
| `check_dmarc` | DMARC parsing and policy validation |
| `parse_dmarc_report` | Parse a DMARC aggregate (RUA) XML report into structured sources, counts, and SPF/DKIM/DMARC results |
| `check_bimi` | BIMI DNS, hosted SVG/logo URL, and VMC/CMC readiness |
| `check_mta_sts` | MTA-STS DNS and policy-file validation |
| `check_smtp_tls` | Live SMTP STARTTLS, TLS certificate, hostname, expiry, PTR, and FCrDNS checks |
| `check_fcrdns` | Dedicated PTR and forward-confirmed reverse DNS evidence for mail-server IPs |
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
- "Give me the complete DNS and email security report for intodns.ai as Markdown."
- "Create a fixed audit snapshot for intodns.ai that I can cite in a support ticket."
- "Check whether example.com meets Google and Yahoo sender requirements."
- "Check SMTP STARTTLS certificate posture and FCrDNS for example.com."
- "Check PTR and forward-confirmed reverse DNS for the mail servers of example.com."
- "Does example.com have BIMI configured, and does Gmail require a VMC or CMC?"
- "Show the SPF lookup graph and tell me whether example.com is close to the 10 lookup limit."
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
