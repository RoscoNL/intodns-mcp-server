import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export declare const VERSION = "1.10.1";
/**
 * Register all IntoDNS tools on an existing McpServer instance.
 * Used by the stdio entry, the standalone --http mode, and remote hosts
 * (e.g. the Next.js /api/mcp route on intodns.ai) that construct their own
 * server per request.
 */
export declare function registerTools(server: McpServer): void;
/** Create a fresh McpServer with every IntoDNS tool registered. */
export declare function createServer(): McpServer;
//# sourceMappingURL=server.d.ts.map