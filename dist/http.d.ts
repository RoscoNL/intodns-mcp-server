/**
 * Stateless Streamable HTTP mode: every POST gets a fresh McpServer +
 * transport, so any number of processes can serve the endpoint without
 * shared session state. GET (SSE streams) and DELETE (session teardown)
 * are meaningless without sessions and return 405 as the spec suggests.
 */
export declare function startHttpServer(port: number): Promise<void>;
//# sourceMappingURL=http.d.ts.map