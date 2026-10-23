import { createOpenAPI } from "fumadocs-openapi/server";

// The server's own spec. Refresh it with `curl <server>/openapi/json > openapi/kite.json`, then `pnpm api`.
// Pages leave the spec out of their HTML and load it once, as one shared chunk.
export const openapi = createOpenAPI({
  input: ["./openapi/kite.json"],
  includeDocument: false,
});
