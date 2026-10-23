// Throwaway secrets for the screenshot run: printed as env lines, never written to disk.
const SERVER = process.env.KITE_SERVER_DIR!;
const { generateMnemonic, english } = await import(
  `${SERVER}/node_modules/viem/_esm/accounts/index.js`
);
const b = (n: number) => Buffer.from(crypto.getRandomValues(new Uint8Array(n)));
console.log(
  JSON.stringify({
    KITE_ENCRYPTION_KEY: b(32).toString("base64"),
    KITE_OPERATOR_MNEMONIC: generateMnemonic(english),
    KITE_ROOT_KEY: "screenshots-" + b(16).toString("hex"),
  }),
);
