import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer, VERSION } from "./server.js";

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : null;
}

function jsonError(res: ServerResponse, status: number, message: string): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32000, message }, id: null }));
}

/**
 * Stateless Streamable HTTP mode: every POST gets a fresh McpServer +
 * transport, so any number of processes can serve the endpoint without
 * shared session state. GET (SSE streams) and DELETE (session teardown)
 * are meaningless without sessions and return 405 as the spec suggests.
 */
export async function startHttpServer(port: number): Promise<void> {
  const httpServer = createHttpServer(async (req, res) => {
    const url = new URL(req.url || "/", "http://localhost");
    if (url.pathname !== "/mcp") {
      if (url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", server: "intodns-mcp", version: VERSION }));
        return;
      }
      jsonError(res, 404, "Not found. MCP endpoint is POST /mcp");
      return;
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      jsonError(res, 405, "Method not allowed. Stateless server: send JSON-RPC over POST.");
      return;
    }

    try {
      const body = await readJsonBody(req);
      const server = createServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless
      });
      res.on("close", () => {
        void transport.close();
        void server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (error) {
      if (!res.headersSent) {
        jsonError(res, 500, error instanceof Error ? error.message : "Internal error");
      }
    }
  });

  await new Promise<void>((resolve) => httpServer.listen(port, resolve));
  console.error(`intodns-mcp v${VERSION} listening on http://localhost:${port}/mcp (stateless Streamable HTTP)`);
}
