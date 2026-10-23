// Opens a transfer for a quote, like checkout.openTransfer minus the on-chain operator check:
// the throwaway operator wallet isn't an operator on the real testnet factory. The pay-in address
// is still predicted by that factory over RPC. Used only while taking screenshots.
const SERVER = process.env.KITE_SERVER_DIR!;
const S = `${SERVER}/src`;
const { db } = await import(`${S}/db/index.ts`);
const schema = await import(`${S}/db/schema/index.ts`);
const { kite } = await import(`${S}/shared/kiteContract.ts`);
const { eq } = await import(`${SERVER}/node_modules/drizzle-orm/index.js`);
const { getAddress, createPublicClient, http } = await import(
  `${SERVER}/node_modules/viem/_esm/index.js`
);
const { baseSepolia } = await import(
  `${SERVER}/node_modules/viem/_esm/chains/index.js`
);
const [quoteId, refundAddress] = process.argv.slice(2);
const [q] = await db
  .select()
  .from(schema.quote)
  .where(eq(schema.quote.id, quoteId));
const src = (
  await db
    .select()
    .from(schema.token)
    .where(eq(schema.token.id, q.sourceTokenId))
)[0];
const dst = (
  await db
    .select()
    .from(schema.token)
    .where(eq(schema.token.id, q.targetTokenId))
)[0];
const cfg = (
  await db
    .select()
    .from(schema.chainConfig)
    .where(eq(schema.chainConfig.chainId, q.chainId))
)[0];
const id = crypto.randomUUID();
const struct = kite.buildTransferInput({
  transferId: id,
  payInTokenAddress: src.address,
  amountIn: q.sourceAmount,
  settlementTokenAddress: dst.address,
  settlementRecipient: cfg.settlementAddress,
  minAmountOut: q.targetAmount,
  fees: [],
  refundAddress: getAddress(refundAddress),
  expiresAt: q.expiresAt,
  routerAddress: "0x0000000000000000000000000000000000000000",
  poolFeeTier: 0,
});
const client = createPublicClient({
  chain: baseSepolia,
  transport: http("https://sepolia.base.org"),
});
const payinAddress = await kite.predictAddress(
  client,
  cfg.kiteFactoryAddress,
  struct,
);
const [saved] = await db
  .insert(schema.transfer)
  .values({
    id,
    appId: q.appId,
    quoteId: q.id,
    settlementRecipient: cfg.settlementAddress,
    minAmountOut: q.targetAmount,
    refundAddress: struct.refundAddress,
    payinAddress,
    kiteTransferInput: kite.serializeTransferInput(struct),
    status: "AwaitingDeposit",
  } as any)
  .returning();
const paymentInstructions = {
  caip2Id: "eip155:84532",
  address: payinAddress,
  tokenAddress: src.address,
  amount: q.sourceAmount.toString(),
  expiresAt: q.expiresAt,
};
console.log(
  JSON.stringify({
    ...saved,
    minAmountOut: saved.minAmountOut.toString(),
    paymentInstructions,
  }),
);
process.exit(0);
