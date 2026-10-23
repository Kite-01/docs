// Marks the newest transfer settled, so the checkout shows its completed state.
const SERVER = process.env.KITE_SERVER_DIR!;
const S = `${SERVER}/src`;
const { db } = await import(`${S}/db/index.ts`);
const schema = await import(`${S}/db/schema/index.ts`);
const { desc, eq } = await import(
  `${SERVER}/node_modules/drizzle-orm/index.js`
);
const [t] = await db
  .select()
  .from(schema.transfer)
  .orderBy(desc(schema.transfer.createdAt))
  .limit(1);
const hash =
  "0x" +
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
await db
  .update(schema.transfer)
  .set({ status: "Settled", settlementBlockchainHash: hash })
  .where(eq(schema.transfer.id, t.id));
console.log("settled", t.id, t.status, "->", "Settled");
process.exit(0);
