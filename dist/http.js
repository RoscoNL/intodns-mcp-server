"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHttpServer = startHttpServer;
const node_http_1 = require("node:http");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const server_js_1 = require("./server.js");
const MAX_REQUEST_BYTES = 1_000_000;
class HttpError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
function splitEnvList(value) {
    return value
        ?.split(",")
        .map((entry) => entry.trim())
        .filter(Boolean) ?? [];
}
async function readJsonBody(req) {
    const contentType = req.headers["content-type"]?.split(";", 1)[0]?.trim().toLowerCase();
    if (contentType !== "application/json") {
        throw new HttpError(415, "Content-Type must be application/json");
    }
    const contentLength = Number(req.headers["content-length"]);
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
        throw new HttpError(413, `Request body exceeds ${MAX_REQUEST_BYTES} bytes`);
    }
    const chunks = [];
    let totalBytes = 0;
    for await (const chunk of req) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        totalBytes += buffer.byteLength;
        if (totalBytes > MAX_REQUEST_BYTES) {
            throw new HttpError(413, `Request body exceeds ${MAX_REQUEST_BYTES} bytes`);
        }
        chunks.push(buffer);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    if (!raw) {
        throw new HttpError(400, "Request body must contain JSON-RPC JSON");
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        throw new HttpError(400, "Malformed JSON request body");
    }
}
function jsonError(res, status, message) {
    res.writeHead(status, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
    });
    res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32000, message }, id: null }));
}
function isAllowedHeader(value, allowed) {
    return value === undefined || allowed.includes(value);
}
/**
 * Stateless Streamable HTTP mode: every POST gets a fresh McpServer +
 * transport, so any number of processes can serve the endpoint without
 * shared session state. GET (SSE streams) and DELETE (session teardown)
 * are meaningless without sessions and return 405 as the spec suggests.
 */
async function startHttpServer(port) {
    const host = process.env.INTODNS_HTTP_HOST?.trim() || "127.0.0.1";
    const allowedHosts = [
        `localhost:${port}`,
        `127.0.0.1:${port}`,
        `[::1]:${port}`,
        ...splitEnvList(process.env.INTODNS_ALLOWED_HOSTS),
    ];
    if (host !== "0.0.0.0" && host !== "::") {
        allowedHosts.push(`${host}:${port}`);
    }
    const allowedOrigins = [
        `http://localhost:${port}`,
        `http://127.0.0.1:${port}`,
        `http://[::1]:${port}`,
        ...splitEnvList(process.env.INTODNS_ALLOWED_ORIGINS),
    ];
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
        if (!isAllowedHeader(req.headers.host, allowedHosts)) {
            jsonError(res, 403, "Invalid Host header");
            return;
        }
        const origin = Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin;
        if (!isAllowedHeader(origin, allowedOrigins)) {
            jsonError(res, 403, "Invalid Origin header");
            return;
        }
        try {
            const body = await readJsonBody(req);
            const server = (0, server_js_1.createServer)();
            const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
                sessionIdGenerator: undefined, // stateless
                enableDnsRebindingProtection: true,
                allowedHosts,
                allowedOrigins,
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
                if (error instanceof HttpError) {
                    jsonError(res, error.status, error.message);
                }
                else {
                    console.error("MCP HTTP request failed", error);
                    jsonError(res, 500, "Internal server error");
                }
            }
        }
    });
    await new Promise((resolve) => httpServer.listen(port, host, resolve));
    console.error(`intodns-mcp v${server_js_1.VERSION} listening on http://${host}:${port}/mcp (stateless Streamable HTTP)`);
}
//# sourceMappingURL=http.js.map