# IntoDNS MCP — promotie drafts

Genereerd 2026-05-18 voor manual posting door Jeroen.

---

## 1. Hacker News — Show HN

**Titel** (max 80 chars):
> Show HN: IntoDNS MCP – Free DNS/email security tools for Claude and AI agents

**URL:** https://github.com/RoscoNL/intodns-mcp-server

**Tekst (optioneel, alleen als geen URL post):**
> Hi HN — I built an MCP server that gives Claude, Cursor, ChatGPT and other AI agents direct access to DNS, DMARC, SPF, DKIM, BIMI, DNSSEC, MTA-STS, FCrDNS, blacklist and SMTP-TLS checks. 45 tools, no API key, no signup. The interesting bit is the `snapshot` tool — it returns a content-hashed evidence URL so AI answers can cite a stable, timestamped report instead of "according to my training data".
>
> Why MCP and not just a CLI: Claude can now scan a domain mid-conversation, fix the DMARC record, and link to a snapshot URL the user can paste into a ticket months later.
>
> Built on top of intodns.ai (also free, no signup). Backend hosts the snapshots, the MCP shim is open source.
>
> Install: `npx -y intodns-mcp`
>
> Feedback welcome — especially on which checks are missing.

---

## 2. Reddit r/mcp

**Titel:**
> IntoDNS MCP — free DNS & email security scanner (45 tools, no API key)

**Body:**
> Just published an MCP server that exposes IntoDNS.ai's free DNS and email security scanner to Claude Desktop, Cursor and any other MCP client.
>
> **What you get (45 tools):**
> - DNS: lookup, DNSSEC, TLSA/DANE, propagation
> - Email: SPF, DKIM, DMARC, BIMI, MTA-STS, SMTP-TLS, FCrDNS, blacklist, sender requirements
> - Reports: quick scan, everything-report, deep scan, **citation-grade snapshots with content hashes**
> - Plus PDF/badge generation and an API discovery helper
>
> **Install** (Claude Desktop / Cursor):
> ```json
> {
>   "mcpServers": {
>     "intodns": { "command": "npx", "args": ["-y", "intodns-mcp"] }
>   }
> }
> ```
>
> No API key, no signup. Free public diagnostic endpoints with generous rate limits.
>
> Source: https://github.com/RoscoNL/intodns-mcp-server
> npm: https://www.npmjs.com/package/intodns-mcp
> Service: https://intodns.ai

---

## 3. Reddit r/sysadmin

**Titel:**
> Free MCP server for AI-assisted DNS/email troubleshooting (SPF, DKIM, DMARC, BIMI, MTA-STS)

**Body:**
> If you use Claude or Cursor to debug mail-delivery tickets, I open-sourced an MCP server that gives the AI direct access to live DNS and email security checks. 45 tools — everything from a basic dig lookup to a full DMARC alignment audit with explanations.
>
> The most useful one in practice: `create_report_snapshot` — returns a fixed, timestamped, content-hashed URL you can paste into a Jira ticket so the evidence stays stable even after the customer "fixes" the DNS half an hour later.
>
> Install: `npx -y intodns-mcp` and add to your MCP client config.
>
> No API key, no signup, no telemetry. Backend is intodns.ai (also free).
>
> Source: https://github.com/RoscoNL/intodns-mcp-server

---

## 4. Reddit r/LocalLLaMA

**Titel:**
> intodns-mcp — give your local LLM real DNS/email security tools

**Body:**
> For folks running Claude or local-model agents that need to interact with real-world infrastructure: I published an MCP wrapper around intodns.ai. 45 tools covering DNS, DMARC, SPF, DKIM, BIMI, DNSSEC, MTA-STS, FCrDNS, blacklists.
>
> Snapshot tool returns content-hashed URLs so your model can cite stable evidence instead of hallucinating a "best practice" answer.
>
> `npx -y intodns-mcp` — no API key required.
>
> https://github.com/RoscoNL/intodns-mcp-server

---

## 5. X / Twitter

> Just shipped intodns-mcp: 45 free DNS + email security tools for Claude, Cursor and any MCP agent. SPF, DKIM, DMARC, BIMI, DNSSEC, MTA-STS, blacklist, snapshot reports with content hashes — no API key.
>
> `npx -y intodns-mcp`
>
> https://github.com/RoscoNL/intodns-mcp-server

---

## 6. LinkedIn

> I shipped a free MCP (Model Context Protocol) server that lets AI assistants like Claude, Cursor and ChatGPT run live DNS and email-security checks during a conversation. 45 tools covering SPF, DKIM, DMARC, BIMI, DNSSEC, MTA-STS, FCrDNS, blacklists — plus citation-grade report snapshots with content hashes for audit trails.
>
> If you've ever tried to debug a deliverability issue while jumping between MxToolbox tabs and your terminal, this collapses the loop: the AI can scan, diagnose and cite stable evidence in one go.
>
> Open source, no API key, no signup. Backed by intodns.ai (also free for public diagnostics).
>
> https://github.com/RoscoNL/intodns-mcp-server

---

## 7. DEV.to / blog post outline

**Titel:**
> Building IntoDNS MCP: giving AI agents real DNS + email security tools

**Sections:**
1. The problem: LLMs hallucinate when asked "is my domain configured correctly?"
2. Why MCP instead of a plain API
3. Tool design choices — quick scan vs full report vs snapshot
4. Why content-hashed snapshots are the hidden killer feature for AI citations
5. Demo: scan example.com from Claude Desktop in one prompt
6. What I learned shipping to the MCP ecosystem (Smithery, awesome lists)
7. Roadmap: more deliverability, more privacy primitives, more languages

---

## Timing & cadence advies

- **HN:** beste tijdslot di-do, 8-11u ET (14-17u CET). Eén post; geen reposts.
- **Reddit r/mcp + r/sysadmin + r/LocalLLaMA:** spreid 1-2 dagen tussen elk om geen cross-posting flag te krijgen.
- **X:** zelfde dag als HN.
- **LinkedIn:** dag erna.
- **DEV.to:** binnen 7 dagen na HN, link terug naar HN-discussie.
