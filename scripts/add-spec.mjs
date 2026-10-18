import { readFile, writeFile } from "node:fs/promises";

const source = process.argv[2];
if (!source) {
  console.error(
    "Usage: pnpm spec:add <url or file>\n" +
      "  e.g. https://pay.example.com/openapi/json, or a file from the server's `bun run spec`",
  );
  process.exit(1);
}

const text = /^https?:\/\//.test(source)
  ? await fetch(source).then((response) => {
      if (!response.ok)
        throw new Error(`${source} answered ${response.status}`);
      return response.text();
    })
  : await readFile(source, "utf8");

const spec = JSON.parse(text);
const version = spec.info?.version;
if (!spec.openapi || !spec.paths || !version) {
  throw new Error(`${source} is not an OpenAPI spec with a version`);
}

// Every Kite server is self-hosted, so requests go to the reader's own one.
spec.info.description =
  "The API of a Kite server. Requests go to your own server: set its URL below.";
spec.servers = [
  {
    url: "{baseUrl}",
    variables: { baseUrl: { default: "https://pay.example.com" } },
  },
];

await writeFile(
  new URL(`../public/api/${version}.json`, import.meta.url),
  `${JSON.stringify(spec, null, 2)}\n`,
);

const manifest = new URL("../src/api-versions.json", import.meta.url);
const versions = JSON.parse(await readFile(manifest, "utf8").catch(() => "[]"));
const byNewest = (a, b) =>
  b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" });

await writeFile(
  manifest,
  `${JSON.stringify([...new Set([...versions, version])].sort(byNewest), null, 2)}\n`,
);

console.log(
  `public/api/${version}.json: ${Object.keys(spec.paths).length} paths`,
);
