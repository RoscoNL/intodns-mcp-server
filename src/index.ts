#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer, VERSION } from "./server.js";

function printHelp(): void {
  console.log(`intodns-mcp v${VERSION} — MCP server for IntoDNS.ai

Usage:
  intodns-mcp              Run over stdio (default; for MCP client configs)
  intodns-mcp --http [port]  Run as a stateless Streamable HTTP server
                             (default port 3002, endpoint POST /mcp)
  intodns-mcp --help       Show this help
  intodns-mcp --version    Show version

Environment:
  INTODNS_SITE_URL          Base site URL (default https://intodns.ai)
  INTODNS_REQUEST_TIMEOUT_MS  Upstream timeout in milliseconds (default 60000)
  INTODNS_HTTP_HOST         HTTP bind address (default 127.0.0.1)
  INTODNS_ALLOWED_HOSTS     Extra comma-separated HTTP Host values
  INTODNS_ALLOWED_ORIGINS   Extra comma-separated browser origins
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--version")) {
    console.log(VERSION);
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

  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
