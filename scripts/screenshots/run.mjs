// Regenerates public/screenshots from a real Kite server, end to end:
// a throwaway Postgres and server in testnet mode, seeded with demo data, then every capture.
// Needs the server repo checked out next to this one (or KITE_SERVER_DIR), with `bun install` done there.
import { spawn, execSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SERVER = resolve(
  process.env.KITE_SERVER_DIR ?? join(here, "../../../server"),
);
const OUT = resolve(here, "../../public/screenshots");
const PG_PORT = 54329,
  PORT = 3000;
const env = { ...process.env, KITE_SERVER_DIR: SERVER };

const waitFor = (child, text) =>
  new Promise((ok, fail) => {
    let log = "";
    const on = (d) => {
      log += d;
      if (log.includes(text)) ok();
    };
    child.stdout.on("data", on);
    child.stderr.on("data", on);
    child.on("exit", (code) =>
      fail(new Error(`exited ${code} before "${text}":\n${log.slice(-2000)}`)),
    );
  });

const dir = mkdtempSync(join(tmpdir(), "kite-shots-"));
const pg = spawn(
  "bun",
  [join(here, "pg.ts"), join(dir, "pg"), String(PG_PORT)],
  { env },
);
let server;
try {
  await waitFor(pg, "PG READY");
  Object.assign(
    env,
    JSON.parse(execSync(`bun ${join(here, "keys.ts")}`, { env }).toString()),
    {
      KITE_PORT: String(PORT),
      KITE_PUBLIC_BASE_URL: `http://localhost:${PORT}`,
      KITE_PG_DB_URL: `postgres://postgres:postgres@localhost:${PG_PORT}/kite`,
      KITE_ENABLE_DASHBOARD: "true",
      KITE_ENABLE_OPENAPI_UI_SPECS: "true",
      KITE_ENABLE_OPENAPI_UI_PROVIDER: "scalar",
      KITE_IS_TESTNET: "true",
      KITE_BASE_URL: `http://localhost:${PORT}`,
    },
  );
  execSync("bun run migrate", { cwd: SERVER, env, stdio: "inherit" });
  server = spawn("bun", ["src/index.ts"], { cwd: SERVER, env });
  await waitFor(server, "listening");
  // The dashboard is compiled on its first request; load it once before the captures start.
  for (let i = 0; i < 60; i++) {
    const r = await fetch(`http://localhost:${PORT}/`).catch(() => null);
    if (r?.ok) break;
    await new Promise((r) => setTimeout(r, 2000));
  }
  execSync(
    `node -e "require('playwright').chromium.launch().then(async b=>{const p=await b.newPage();await p.goto('http://localhost:${PORT}/',{timeout:180000});await p.waitForSelector('input',{timeout:180000});await b.close()})"`,
    { cwd: here, env, stdio: "inherit" },
  );
  execSync(`bun ${join(here, "seed.ts")}`, {
    cwd: SERVER,
    env,
    stdio: "inherit",
  });
  execSync(`node ${join(here, "capture.mjs")} ${OUT}`, {
    env,
    stdio: "inherit",
  });
  console.log("screenshots: written to", OUT);
} finally {
  server?.kill();
  pg.kill("SIGTERM");
  await new Promise((r) => setTimeout(r, 1500));
  rmSync(dir, { recursive: true, force: true });
}
