// A throwaway Postgres for the screenshot run, from the server's own embedded-postgres.
const SERVER = process.env.KITE_SERVER_DIR!;
const { default: EmbeddedPostgres } = await import(
  `${SERVER}/node_modules/embedded-postgres/dist/index.js`
);
const [dir, port] = process.argv.slice(2);
const pg = new EmbeddedPostgres({
  databaseDir: dir,
  user: "postgres",
  password: "postgres",
  port: Number(port),
  persistent: false,
  onLog: () => {},
});
await pg.initialise();
await pg.start();
await pg.createDatabase("kite");
console.log("PG READY");
const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
setInterval(() => {}, 1 << 30);
