"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHttpServer = startHttpServer;
const node_http_1 = require("node:http");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const server_js_1 = require("./server.js");
async function readJsonBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    return raw ? JSON.parse(raw) : null;
}
function jsonError(res, status, message) {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32000, message }, id: null }));
}
/**
 * Stateless Streamable HTTP mode: every POST gets a fresh McpServer +
 * transport, so any number of processes can serve the endpoint without
 * shared session state. GET (SSE streams) and DELETE (session teardown)
 * are meaningless without sessions and return 405 as the spec suggests.
 */
async function startHttpServer(port) {
    const httpServer = (0, node_http_1.createServer)(async (req, res) => {
        const url = new URL(req.url || "/", "http://localhost");
        if (url.pathname !== "/mcp") {
            if (url.pathname === "/health") {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ status: "ok", server: "intodns-mcp", version: server_js_1.VERSION }));
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
            const server = (0, server_js_1.createServer)();
            const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
                sessionIdGenerator: undefined, // stateless
            });
            res.on("close", () => {
                void transport.close();
                void server.close();
            });
            await server.connect(transport);
            await transport.handleRequest(req, res, body);
        }
        catch (error) {
            if (!res.headersSent) {
                jsonError(res, 500, error instanceof Error ? error.message : "Internal error");
            }
        }
    });
    await new Promise((resolve) => httpServer.listen(port, resolve));
    console.error(`intodns-mcp v${server_js_1.VERSION} listening on http://localhost:${port}/mcp (stateless Streamable HTTP)`);
}
//# sourceMappingURL=http.js.map