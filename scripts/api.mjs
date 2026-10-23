// Generates the API reference pages from the server's OpenAPI spec (openapi/kite.json).
// Update the spec from a running server first: curl https://<server>/openapi/json > openapi/kite.json
import { generateFiles } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";
import { readdirSync, rmSync, statSync, writeFileSync } from "node:fs";

const output = "./content/docs/api-reference";
// Clear the previous run's folders; index.mdx is written by hand.
for (const name of readdirSync(output)) {
  if (statSync(`${output}/${name}`).isDirectory())
    rmSync(`${output}/${name}`, { recursive: true });
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

await generateFiles({
  input: createOpenAPI({ input: ["./openapi/kite.json"] }),
  output,
  per: "operation",
  groupBy: "tag",
  includeDescription: true,
  // paymentLinks.create -> payment-links/create, api-key/... -> api-keys/...
  beforeWrite(files) {
    for (const file of files) {
      file.path = file.path
        .replace(/^api-key\//, "api-keys/")
        .replace(
          /[A-Za-z0-9]+\.([A-Za-z0-9]+)\.mdx$/,
          (_, action) => `${kebab(action)}.mdx`,
        );
    }
  },
});

// Sidebar: groups in the order an integrator meets them, each with a readable title.
const groups = [
  ["payment-links", "Payment links"],
  ["checkout", "Checkout"],
  ["transfers", "Transfers"],
  ["quotes", "Quotes"],
  ["customers", "Customers"],
  ["webhooks", "Webhooks"],
  ["x402", "x402"],
  ["api-keys", "API keys"],
  ["apps", "Apps"],
  ["fees", "Fees"],
  ["chains", "Chains"],
  ["tokens", "Tokens"],
  ["price-feeds", "Price feeds"],
  ["rates", "Rates"],
  ["overview", "Overview"],
  ["kv", "Provider keys"],
];
const present = groups.filter(([dir]) =>
  statSync(`${output}/${dir}`, { throwIfNoEntry: false })?.isDirectory(),
);
for (const [dir, title] of present)
  writeFileSync(
    `${output}/${dir}/meta.json`,
    JSON.stringify({ title }, null, 2) + "\n",
  );
writeFileSync(
  `${output}/meta.json`,
  JSON.stringify(
    {
      title: "API Reference",
      pages: ["index", ...present.map(([dir]) => dir)],
    },
    null,
    2,
  ) + "\n",
);
console.log("api: reference pages written to", output);
