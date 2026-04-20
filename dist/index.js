#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const BASE_URL = "https://intodns.ai/api";
async function apiFetch(path) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "User-Agent": "intodns-mcp/1.0" },
    });
    if (!res.ok) {
        throw new Error(`IntoDNS.ai API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}
const server = new mcp_js_1.McpServer({
    name: "intodns",
    version: "1.0.0",
});
server.tool("scan_domain", "Run a full DNS & email security scan on a domain. Returns a grade (A+ to F), security score, and findings for DNS, email authentication (SPF/DKIM/DMARC), blacklists, and DNSSEC.", { domain: zod_1.z.string().describe("Domain name to scan, e.g. example.com") }, async ({ domain }) => {
    const data = await apiFetch(`/scan/quick?domain=${encodeURIComponent(domain)}`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
server.tool("check_email_security", "Check email authentication records for a domain: SPF, DKIM, DMARC, and blacklist status. Returns parsed records, validity, issues, and recommendations.", { domain: zod_1.z.string().describe("Domain name to check, e.g. example.com") }, async ({ domain }) => {
    const data = await apiFetch(`/email/check?domain=${encodeURIComponent(domain)}`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
server.tool("lookup_dns", "Look up DNS records for a domain. Supports record types: A, AAAA, MX, TXT, NS, CNAME, SOA, CAA, SRV.", {
    domain: zod_1.z.string().describe("Domain name to look up"),
    type: zod_1.z
        .enum(["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA", "CAA", "SRV"])
        .describe("DNS record type"),
}, async ({ domain, type }) => {
    const data = await apiFetch(`/dns/lookup?domain=${encodeURIComponent(domain)}&type=${type}`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
server.tool("check_dns_propagation", "Check if DNS changes have propagated globally by querying multiple resolvers across different regions.", { domain: zod_1.z.string().describe("Domain name to check propagation for") }, async ({ domain }) => {
    const data = await apiFetch(`/dns/propagation?domain=${encodeURIComponent(domain)}`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
server.tool("validate_dnssec", "Validate DNSSEC configuration for a domain. Checks signing, key chain, and DS record presence.", { domain: zod_1.z.string().describe("Domain name to validate DNSSEC for") }, async ({ domain }) => {
    const data = await apiFetch(`/dns/dnssec?domain=${encodeURIComponent(domain)}`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch(console.error);
//# sourceMappingURL=index.js.map