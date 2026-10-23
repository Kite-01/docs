"use client";
import { createOpenAPIPage } from "fumadocs-openapi/ui";

export const APIPage = createOpenAPIPage({
  loadDocument: async () =>
    (await import("../openapi/kite.json")).default as never,
});
