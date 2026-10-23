---
title: Authentication
description: The two ways to authenticate to a Kite server, and which routes need neither.
---

Every request under `/api` authenticates one of two ways, except checkout's.

| Credential   | Who uses it                       | Can do                                      |
| ------------ | --------------------------------- | ------------------------------------------- |
| **API key**  | Your applications                 | What its scopes allow, for its own app only |
| **Root key** | You, the dashboard, admin scripts | Everything, for any app                     |

## API keys

An API key is an Ed25519 key pair. The server stores only the public half. Your application keeps the private half and signs every request with it, so a request can't be forged or replayed, and the private key never crosses the network.

Each key belongs to one app and carries a set of scopes. See [API keys](/authentication/api-keys/) to create one and [Signing requests](/authentication/signing-requests/) for how signing works. [`@kite-01/sdk`](/integrate/sdk/) signs for you.

## The root key

The root key is `KITE_ROOT_KEY` from your [configuration](/server/configuration/), sent as a header:

```http
x-kite-root-key: <your root key>
x-kite-app-id: <app id>
```

`x-kite-app-id` is optional. Without it, the root key works across the whole server, such as listing all apps or managing chains. With it, the request acts as that app, as if made with one of its API keys holding every scope.

Some routes take only the root key: creating and listing apps, adding and configuring chains, removing tokens, price feeds, provider keys and the overview stats. Keep the root key on machines you control and out of applications.

## No credentials

The checkout routes under `/api/checkout/{payment link id}` need no credentials, so checkout can run in any browser. They can only read what's needed to pay a link, quote it, open a transfer for it and follow that transfer.

## Errors

| Status | When                                                                                            |
| ------ | ----------------------------------------------------------------------------------------------- |
| `401`  | No credentials, an unknown or revoked key, a bad signature, an old timestamp or a reused nonce. |
| `403`  | The key lacks the scope, or the route needs the root key.                                       |

The body says which: `{ "error": { "code": "Unauthorized", "message": "Invalid signature" } }`.
