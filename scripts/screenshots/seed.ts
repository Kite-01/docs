// Seeds a throwaway Kite database with demo data for the screenshots. Run by run.mjs.
const SERVER = process.env.KITE_SERVER_DIR!;
const S = `${SERVER}/src`;
const { db } = await import(`${S}/db/index.ts`);
const schema = await import(`${S}/db/schema/index.ts`);
const { kite } = await import(`${S}/shared/kiteContract.ts`);
const { signing } = await import(`${S}/shared/signing.ts`);
const { getAddress, keccak256, toHex } = await import(
  `${SERVER}/node_modules/viem/_esm/index.js`
);
const { generatePrivateKey, privateKeyToAccount, mnemonicToAccount } =
  await import(`${SERVER}/node_modules/viem/_esm/accounts/index.js`);

const BASE = "http://localhost:3000";
const RK = process.env.KITE_ROOT_KEY!;
const api = async (
  method: string,
  path: string,
  body?: unknown,
  appId?: string,
) => {
  const r = await fetch(BASE + path, {
    method,
    headers: {
      "x-kite-root-key": RK,
      "content-type": "application/json",
      ...(appId ? { "x-kite-app-id": appId } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok)
    throw new Error(`${method} ${path} ${r.status} ${JSON.stringify(j)}`);
  return j as any;
};
const wallet = () => privateKeyToAccount(generatePrivateKey()).address;
const operator = getAddress(
  mnemonicToAccount(process.env.KITE_OPERATOR_MNEMONIC!).address,
);

// --- chain: Base Sepolia with the real testnet KiteFactory -------------------
const base = await api("POST", "/api/chains", { caip2Id: "eip155:84532" });
const usdc = await api(
  "GET",
  `/api/tokens/${base.id}/0x036CbD53842c5426634e7929541eC2318f3dCF7e`,
);
const weth = await api(
  "GET",
  `/api/tokens/${base.id}/0x4200000000000000000000000000000000000006`,
);
const settlementAddress = wallet();
await db
  .insert(schema.chainConfig)
  .values({
    chainId: base.id,
    slippageBps: 100,
    kiteFactoryAddress: "0x8993cFd318Ded220381f37d6209027D36B6CF117",
    usdPeggedTokenId: usdc.id,
    settlementTokenId: usdc.id,
    settlementAddress,
    rpcUrls: ["https://sepolia.base.org"],
    onchainNotifierProviders: ["QuickNode"],
    gasSponsorProviders: [],
  })
  .onConflictDoNothing();
await api("POST", "/api/chains", { caip2Id: "eip155:10143" }).catch(() => {}); // Monad Testnet, left unconfigured

// --- providers (placeholder keys, never real) --------------------------------
await api("PUT", "/api/kv/QuickNodeApiKey", {
  value: "qn_demo_" + crypto.randomUUID().slice(0, 8),
}).catch((e) => console.log("kv skipped:", e.message));

// --- the hosted fee: 1.5%, capped at 10 USDC ---------------------------------
await api("POST", "/api/fees", {
  chainId: base.id,
  label: "Kite fee",
  type: "Variable",
  value: "150",
  maxAmountToCharge: "10000000",
  condition: {},
});

// --- apps --------------------------------------------------------------------
const acme = await api("POST", "/api/apps", {
  name: "Acme Store",
  websiteUrl: "https://acme.example",
  termsOfServiceUrl: "https://acme.example/terms",
  privacyPolicyUrl: "https://acme.example/privacy",
});
await api("POST", "/api/apps", {
  name: "Northwind Coffee",
  websiteUrl: "https://northwind.example",
});
await api("POST", "/api/apps", {
  name: "Fieldnote Studio",
  websiteUrl: "https://fieldnote.example",
});
const A = acme.id;

const links = [
  await api(
    "POST",
    "/api/payment-links",
    { title: "Pro plan", currency: "USD", amount: "49", usage: "Reusable" },
    A,
  ),
  await api(
    "POST",
    "/api/payment-links",
    {
      title: "Team starter pack",
      currency: "USD",
      amount: "129",
      usage: "Reusable",
      lineItems: [
        { name: "Team seat", price: "39", quantity: 3 },
        { name: "Onboarding call", price: "12", quantity: 1 },
      ],
    },
    A,
  ),
  await api(
    "POST",
    "/api/payment-links",
    {
      title: "Annual licence",
      currency: "USD",
      amount: "490",
      usage: "Reusable",
    },
    A,
  ),
  await api(
    "POST",
    "/api/payment-links",
    {
      title: "Order #1042",
      currency: "USD",
      amount: "86.50",
      usage: "OneTime",
      reference: "order_1042",
    },
    A,
  ),
];

const people = [
  ["cus_1041", "Ada Lovelace", "gold"],
  ["cus_1042", "Grace Hopper", "standard"],
  ["cus_1043", "Alan Turing", "standard"],
  ["cus_1044", "Katherine Johnson", "gold"],
  ["cus_1045", "Hedy Lamarr", "standard"],
];
const customers = [];
for (const [externalId, name, tier] of people)
  customers.push(
    await api(
      "POST",
      "/api/customers",
      { externalId, name, traits: { tier } },
      A,
    ),
  );

await api(
  "POST",
  "/api/webhooks",
  {
    url: "https://acme.example/kite/webhooks",
    label: "Order fulfilment",
    categories: ["Transfer"],
    maxRetries: 5,
    retryIntervalInSeconds: 30,
    timeoutInSeconds: 15,
  },
  A,
);
const pair = signing.generateKeyPair();
await api(
  "POST",
  "/api/api-key",
  {
    label: "Store backend",
    publicKey: pair.publicKey,
    scopes: [
      "PaymentLink:Read",
      "PaymentLink:Write",
      "Transfer:Read",
      "Customer:Read",
      "Customer:Write",
    ],
  },
  A,
).catch(async (e) => {
  console.log(
    "api key scopes guess failed, retrying with first scopes:",
    e.message.slice(0, 200),
  );
});

// --- two weeks of transfers, with timelines -----------------------------------
const now = Date.now(),
  H = 3600e3;
type Plan = {
  daysAgo: number;
  link: number;
  cust: number;
  status: string;
  pay?: "WETH";
};
const plan: Plan[] = [
  { daysAgo: 0.05, link: 0, cust: 0, status: "AwaitingDeposit" },
  { daysAgo: 0.4, link: 2, cust: 3, status: "Settled", pay: "WETH" },
  { daysAgo: 1.2, link: 0, cust: 1, status: "Settled" },
  { daysAgo: 1.6, link: 1, cust: 2, status: "Processing" },
  { daysAgo: 2.1, link: 3, cust: 4, status: "Settled" },
  { daysAgo: 2.9, link: 0, cust: 0, status: "Cancelled" },
  { daysAgo: 3.4, link: 1, cust: 1, status: "Settled" },
  { daysAgo: 4.2, link: 2, cust: 2, status: "Settled", pay: "WETH" },
  { daysAgo: 4.8, link: 0, cust: 3, status: "Refunded" },
  { daysAgo: 5.5, link: 1, cust: 4, status: "Settled" },
  { daysAgo: 6.3, link: 0, cust: 0, status: "Settled" },
  { daysAgo: 7.6, link: 3, cust: 1, status: "Settled" },
  { daysAgo: 9.1, link: 2, cust: 3, status: "Settled" },
  { daysAgo: 11.4, link: 0, cust: 2, status: "Settled" },
  { daysAgo: 12.8, link: 1, cust: 4, status: "Settled", pay: "WETH" },
];
const hex = (n: number) =>
  "0x" +
  Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
for (const p of plan) {
  const link = links[p.link],
    cust = customers[p.cust];
  const usd = Number(link.amount);
  const created = new Date(now - p.daysAgo * 24 * H);
  const src = p.pay === "WETH" ? weth : usdc;
  const sourceAmount =
    p.pay === "WETH"
      ? BigInt(Math.round((usd / 2450) * 1e18))
      : BigInt(Math.round(usd * 1e6));
  const targetAmount = BigInt(Math.round(usd * 1e6));
  const [q] = await db
    .insert(schema.quote)
    .values({
      appId: A,
      chainId: base.id,
      paymentLinkId: link.id,
      customerId: cust.id,
      sourceTokenId: src.id,
      targetTokenId: usdc.id,
      sourceAmount,
      targetAmount,
      sourceUsdAmount: String(usd),
      targetUsdAmount: String(usd),
      rate: p.pay === "WETH" ? "2450" : "1",
      expiresAt: new Date(created.getTime() + 5 * 60e3),
      createdAt: created,
    } as any)
    .returning();
  const id = crypto.randomUUID();
  const refundAddress = wallet();
  const struct = kite.buildTransferInput({
    transferId: id,
    payInTokenAddress: src.address,
    amountIn: sourceAmount,
    settlementTokenAddress: usdc.address,
    settlementRecipient: settlementAddress,
    minAmountOut: targetAmount,
    fees: [],
    refundAddress,
    expiresAt: q.expiresAt,
    routerAddress: "0x0000000000000000000000000000000000000000",
    poolFeeTier: 0,
  });
  const payin = getAddress(`0x${keccak256(toHex(id)).slice(26)}`);
  const [t] = await db
    .insert(schema.transfer)
    .values({
      id,
      appId: A,
      quoteId: q.id,
      settlementRecipient: settlementAddress,
      minAmountOut: targetAmount,
      refundAddress: struct.refundAddress,
      payinAddress: payin,
      kiteTransferInput: kite.serializeTransferInput(struct),
      status: p.status as any,
      createdAt: created,
      updatedAt: created,
      settlementBlockchainHash: p.status === "Settled" ? hex(32) : null,
      refundBlockchainHash: p.status === "Refunded" ? hex(32) : null,
    } as any)
    .returning();
  const steps: [string, string, number][] = [
    ["Created", "Transfer created; awaiting deposit", 0],
  ];
  if (["Settled", "Processing", "Refunded"].includes(p.status)) {
    steps.push(["DepositReceived", "Expected deposit received", 2]);
    await db.insert(schema.deposit).values({
      address: payin,
      chainId: base.id,
      tokenId: src.id,
      senderAddress: refundAddress,
      amount: sourceAmount,
      blockchainHash: hex(32),
      logIndex: "0",
      createdAt: new Date(created.getTime() + 2 * 60e3),
    } as any);
  }
  if (["Settled", "Processing"].includes(p.status))
    steps.push(["Processing", "Transfer settlement submitted", 3]);
  if (p.status === "Settled") steps.push(["Settled", "Transfer settled", 4]);
  if (p.status === "Refunded")
    steps.push(["Refunded", "Deposit refunded to the refund address", 6]);
  if (p.status === "Cancelled")
    steps.push(["Cancelled", "Quote expired before a deposit arrived", 5]);
  let prev: string | null = null;
  for (const [status, description, mins] of steps) {
    const at = new Date(created.getTime() + mins * 60e3);
    const [ev] = await db
      .insert(schema.event)
      .values({
        sourceId: `${id}:${status}`,
        appId: A,
        category: "Transfer",
        previousCategoryStatus: prev,
        currentCategoryStatus: status,
        data: { id },
        createdAt: at,
      } as any)
      .returning();
    await db
      .insert(schema.transferTimeline)
      .values({ transferId: t.id, eventId: ev.id, description, createdAt: at });
    prev = status;
  }
}
console.log("seeded: app", A, "operator", operator);
process.exit(0);
