---
title: Configuration
description: Every environment variable a Kite server reads.
---

Kite reads its settings from environment variables, or from a `.env` file in the directory it starts in. It checks them all at startup and refuses to start, naming the problem, if any is missing or invalid.

| Variable                          | Required | Default  | Description                                                                                                  |
| --------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `KITE_PUBLIC_BASE_URL`            | yes      |          | The public URL of this server. Providers send deposit callbacks to it, and checkout links are built from it. |
| `KITE_PG_DB_URL`                  | yes      |          | Postgres connection URL, such as `postgres://user:password@host:5432/kite`.                                  |
| `KITE_ENCRYPTION_KEY`             | yes      |          | 32 random bytes, base64. Encrypts provider keys and webhook secrets at rest.                                 |
| `KITE_OPERATOR_MNEMONIC`          | yes      |          | BIP-39 mnemonic of the operator wallet, which settles and refunds transfers.                                 |
| `KITE_ROOT_KEY`                   | yes      |          | At least 16 characters. Signs you into the dashboard and grants full API access.                             |
| `KITE_PORT`                       |          | `3000`   | Port to listen on.                                                                                           |
| `KITE_ENABLE_DASHBOARD`           |          | `true`   | Serve the dashboard. The checkout at `/pay` is served either way.                                            |
| `KITE_ENABLE_OPENAPI_UI_SPECS`    |          | `true`   | Serve the interactive API docs at `/openapi` and the spec at `/openapi/json`.                                |
| `KITE_ENABLE_OPENAPI_UI_PROVIDER` |          | `scalar` | `scalar` or `swagger`.                                                                                       |
| `KITE_IS_TESTNET`                 |          | `false`  | Run on testnets instead of mainnets. See [Testnets](/server/testnets/).                                      |

## Generating secrets

```sh
# KITE_ENCRYPTION_KEY
openssl rand -base64 32

# KITE_ROOT_KEY
openssl rand -base64 48
```

For the mnemonic, create a new wallet just for Kite with any wallet that shows its recovery phrase, and use it for nothing else.

## Keep these safe

- **`KITE_ENCRYPTION_KEY`**: lose it and the server can't read the provider keys and webhook secrets it stored. Changing it has the same effect.
- **`KITE_OPERATOR_MNEMONIC`**: it controls the operator wallet, which can settle, refund and recover every transfer's funds.
- **`KITE_ROOT_KEY`**: anyone with it can do anything through the API. Use [API keys](/authentication/api-keys/) for your applications instead.

## Not environment variables

Provider keys for QuickNode and Alchemy are set from the dashboard's **Providers** page and stored encrypted in the database. See [Providers](/server/providers/).
