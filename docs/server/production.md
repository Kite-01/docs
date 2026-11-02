# Running in production

## Mainnets

A server with `KITE_IS_TESTNET` unset or `false` offers the mainnets in the server's [chain registry](https://github.com/Kite-01/server/blob/main/src/shared/chains/registry.ts). Each needs your own [Kite factory](/contracts/overview#deploying-a-factory) deployed on it before it can be configured.

## Deploying

Kite is one process and a Postgres database. The Docker image is the simplest way to run it:

```sh
docker build -t kite-server .
docker run -d --restart unless-stopped -p 3000:3000 --env-file .env kite-server
```

Put it behind a reverse proxy or load balancer that terminates HTTPS, and set `KITE_PUBLIC_BASE_URL` to the public HTTPS URL. Use a managed Postgres, or one you back up.

Background work, such as settling transfers and delivering webhooks, runs in the same process on a queue kept in Postgres, so there's nothing else to run.

## Checklist

- [ ] Strong, unique `KITE_ROOT_KEY` and `KITE_ENCRYPTION_KEY`, kept in a secret manager.
- [ ] A dedicated operator mnemonic, set as the operator of your Kite factory on each chain.
- [ ] Your own RPC URLs on each chain.
- [ ] A deposit notifier on each chain that has one, and `KITE_PUBLIC_BASE_URL` reachable from the internet.
- [ ] A gas sponsor on each chain, or native tokens in the operator wallet where there's none.
- [ ] An address you control for every chain each app accepts.
- [ ] Apps use [API keys](/authentication/api-keys) with only the scopes they need, never the root key.
- [ ] [Webhooks](/integrate/webhooks) verified with their signing secret.
- [ ] `KITE_ENABLE_DASHBOARD=false` if nobody should reach the dashboard from this URL. The checkout stays up.

## Upgrading

Pull the new version and restart. The Docker image applies migrations as it starts; from source, run them yourself first:

```sh
git pull
bun install && bun install --cwd client
bun run migrate
bun run build
bun run start
```

<scalar-callout type="warning">

Always use `bun run migrate`. Some releases need data upgrades that it runs after the schema migrations.

</scalar-callout>

## Backups

Back up the database and keep `KITE_ENCRYPTION_KEY` with it: without the key, the provider keys and webhook secrets in a backup can't be read. Funds are never in the database. They're on-chain, in each transfer's contract until it settles or refunds.

## Monitoring

- `GET /api/overview/info` with the root key answers when the server and database are up.
- Watch your gas sponsor's balance or policy limits, or the operator wallet's balance on chains without a sponsor, so settlements don't stall.
- Failed webhook deliveries are listed on each webhook in the dashboard.
