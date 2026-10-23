// Takes every screenshot the docs use, from a running, seeded Kite server. Run by run.mjs.
// usage: node capture.mjs <outDir>   (env: KITE_ROOT_KEY, KITE_SERVER_DIR, KITE_BASE_URL)
import { chromium } from "playwright";
import { execSync } from "node:child_process";
import { generateKeyPairSync } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = process.argv[2];
const BASE = process.env.KITE_BASE_URL ?? "http://localhost:3000";
const RK = process.env.KITE_ROOT_KEY;
const bun = (script, args = "") =>
  execSync(`bun ${join(here, script)} ${args}`, {
    cwd: process.env.KITE_SERVER_DIR,
    env: process.env,
  })
    .toString()
    .trim()
    .split("\n")
    .pop();

const get = async (path, appId) =>
  (
    await fetch(BASE + path, {
      headers: {
        "x-kite-root-key": RK,
        ...(appId ? { "x-kite-app-id": appId } : {}),
      },
    })
  ).json();

const desktop = {
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
};
const phone = {
  viewport: { width: 400, height: 860 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};

const apps = await get("/api/apps/all");
const acme = (apps.data ?? apps).find((a) => a.name === "Acme Store");
const links = (await get("/api/payment-links", acme.id)).data;
const link = (title) => links.find((l) => l.title === title);
const base = (await get("/api/chains/full")).find(
  (c) => c.caip2Id === "eip155:84532",
);
const A = `/apps/${acme.id}`;

// Chromium builds before 137 have no WebCrypto Ed25519; hand the page a real Node-made pair for the API key dialog.
const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const ed25519 = {
  raw: [...publicKey.export({ type: "spki", format: "der" }).subarray(-32)],
  pkcs8: [...privateKey.export({ type: "pkcs8", format: "der" })],
};

const browser = await chromium.launch();

async function page(options) {
  const ctx = await browser.newContext(options);
  await ctx.addInitScript(({ raw, pkcs8 }) => {
    const gen = crypto.subtle.generateKey.bind(crypto.subtle),
      exp = crypto.subtle.exportKey.bind(crypto.subtle);
    const pub = {},
      priv = {};
    crypto.subtle.generateKey = (alg, ...a) =>
      alg === "Ed25519" || alg?.name === "Ed25519"
        ? Promise.resolve({ publicKey: pub, privateKey: priv })
        : gen(alg, ...a);
    crypto.subtle.exportKey = (f, k) =>
      k === pub
        ? Promise.resolve(new Uint8Array(raw).buffer)
        : k === priv
          ? Promise.resolve(new Uint8Array(pkcs8).buffer)
          : exp(f, k);
  }, ed25519);
  const p = await ctx.newPage();
  p.settle = async (ms = 1200) => {
    await p.waitForLoadState("networkidle").catch(() => {});
    await p.waitForTimeout(ms);
  };
  p.shot = async (name) => {
    await p.settle();
    await p.screenshot({ path: `${out}/${name}.png` });
    console.log("shot", name);
  };
  p.go = async (path, name) => {
    await p.goto(BASE + path);
    await p.settle(1500);
    if (name) await p.shot(name);
  };
  return p;
}

// Opening a transfer simulates a deployment on the factory, which the throwaway operator isn't allowed to do.
// Open it the way the server would, minus that check, and answer the page with the same payload.
async function openTransfersLocally(p) {
  await p.route(/\/api\/checkout\/[^/]+\/transfer$/, async (route, req) => {
    if (req.method() !== "POST") return route.continue();
    const body = JSON.parse(req.postData());
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: bun("open-transfer.ts", `${body.quoteId} ${body.refundAddress}`),
    });
  });
}

async function checkoutFlow(p, prefix) {
  await openTransfersLocally(p);
  await p.go(`/pay/${link("Pro plan").id}`, `${prefix}checkout-method-single`);
  await p.getByText("Payment instructions").click();
  await p.shot(`${prefix}checkout-token`);
  await p.getByText("USDC", { exact: true }).first().click();
  await p.shot(`${prefix}checkout-review`);
  await p
    .locator("input")
    .last()
    .fill("0x296c3f1b0a5e8f4c2d9a7b6e1c0d3f5a8b4ea626");
  await p.shot(`${prefix}checkout-review-filled`);
  await p.getByRole("button", { name: /show payment details/i }).click();
  await p.settle(2500);
  await p.shot(`${prefix}checkout-instructions`);
  bun("settle-latest.ts");
  await p.waitForTimeout(9000);
  await p.shot(`${prefix}checkout-complete`);
}

// ---- the dashboard ----
const d = await page(desktop);
await d.go("/");
await d.waitForSelector("input", { timeout: 30000 });
await d.shot("login");
await d.locator("input").first().fill(RK);
await d.getByRole("button", { name: "Sign in" }).click();
await d.settle(2500);
await d.shot("overview");
await d.go("/chains", "chains");
await d
  .getByRole("button", { name: /add chain/i })
  .first()
  .click();
await d.shot("chain-add");
await d.keyboard.press("Escape");
await d.go(`/chains/${base.id}`, "chain-detail");
await d.mouse.click(450, 144);
await d.shot("chain-tokens"); // the Tokens tab
await d.go("/fees", "fees");
await d.go("/apps", "apps");
await d.go("/providers", "providers");
await d.getByText("QuickNode", { exact: true }).first().click();
await d.shot("providers-quicknode");
await d.go("/price-feeds", "price-feeds");
await d.go(A, "app-overview");
await d.go(`${A}/payment-links`, "payment-links");
await d
  .getByRole("button", { name: /new payment link/i })
  .first()
  .click();
await d.settle(600);
await d.locator("[role=dialog] input").nth(0).fill("Pro plan");
await d.locator("[role=dialog] input").nth(1).fill("49");
await d.shot("payment-link-new");
await d.keyboard.press("Escape");
await d.go(`${A}/customers`, "customers");
await d.go(`${A}/api-keys`, "api-keys");
await d
  .getByRole("button", { name: /new api key/i })
  .first()
  .click();
await d.settle(600);
await d.locator("[role=dialog] input").first().fill("Checkout backend");
await d.shot("api-key-new");
await d.getByRole("button", { name: /generate key/i }).click();
await d.settle(1500);
await d.shot("api-key-created");
await d.go(`${A}/quotes`, "quotes");
await d.go(`${A}/transfers`, "transfers");
await d.locator("tbody tr", { hasText: "Settled" }).first().click();
await d.shot("transfer-detail");
await d.keyboard.press("Escape");
await d.locator("tbody tr", { hasText: "Processing" }).first().click();
await d.settle(800);
await d.locator("[role=dialog]").evaluate((el) => {
  const s = [el, ...el.querySelectorAll("*")].find(
    (e) => e.scrollHeight > e.clientHeight + 4,
  );
  if (s) s.scrollTop = s.scrollHeight;
});
await d.shot("transfer-actions");
await d.keyboard.press("Escape");
await d.go(`${A}/webhooks`, "webhooks");
await d
  .getByRole("button", { name: /new webhook/i })
  .first()
  .click();
await d.settle(600);
await d.locator("[role=dialog] input").nth(0).fill("Order fulfilment");
await d
  .locator("[role=dialog] input")
  .nth(1)
  .fill("https://acme.example/kite/webhooks");
await d.shot("webhook-new");
await d.keyboard.press("Escape");
await d.go(`${A}/fees`, "app-fees");

// ---- the API reference ----
await d.go("/openapi", "openapi");
await d
  .locator("aside, nav")
  .getByText("Payment links", { exact: true })
  .first()
  .click();
await d.settle(800);
await d
  .locator("aside, nav")
  .getByText("Create a payment link", { exact: true })
  .first()
  .click();
await d.settle(2500);
await d.shot("openapi-endpoint");

// ---- checkout, as a customer, on a desktop and on a phone ----
const c = await page(desktop);
await c.go(`/pay/${link("Team starter pack").id}`, "checkout-method");
await checkoutFlow(c, "");
await checkoutFlow(await page(phone), "m-");

await browser.close();
