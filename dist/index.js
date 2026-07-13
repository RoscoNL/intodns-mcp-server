#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const server_js_1 = require("./server.js");
function printHelp() {
    console.log(`intodns-mcp v${server_js_1.VERSION} — MCP server for IntoDNS.ai

Usage:
  intodns-mcp              Run over stdio (default; for MCP client configs)
  intodns-mcp --http [port]  Run as a stateless Streamable HTTP server
                             (default port 3002, endpoint POST /mcp)
  intodns-mcp --help       Show this help
  intodns-mcp --version    Show version

Environment:
  INTODNS_SITE_URL   Base site URL (default https://intodns.ai)
`);
}
async function main() {
    const args = process.argv.slice(2);
    if (args.includes("--version")) {
        console.log(server_js_1.VERSION);
        return;
    }
    if (args.includes("--help")) {
        printHelp();
        return;
    }
    const httpIdx = args.indexOf("--http");
    if (httpIdx !== -1) {
        const port = Number(args[httpIdx + 1]) || 3002;
        const { startHttpServer } = await import("./http.js");
        await startHttpServer(port);
        return;
    }
    const server = (0, server_js_1.createServer)();
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
//# sourceMappingURL=index.js.map