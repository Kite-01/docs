---
title: Testnets
description: Try Kite with test tokens, on a server that can never take real payments.
---

Run a separate server with `KITE_IS_TESTNET=true` and its own database to try Kite without real funds.

- A testnet server only offers testnets when you add a chain; a mainnet server only offers mainnets. Test tokens can never pay a real payment link.
- Switching the flag on an existing database hides the other kind of chains rather than deleting them.
- Everything else works the same: providers, the dashboard, the API, webhooks and the packages.

## Supported testnets

| Network          | Chain ID | Existing Kite factory                        |
| ---------------- | -------- | -------------------------------------------- |
| Base Sepolia     | 84532    | `0x8993cFd318Ded220381f37d6209027D36B6CF117` |
| Monad Testnet    | 10143    | `0x60c39c24619be51bC7Ef1B82EaE6d922f9F6da1E` |
| Sepolia          | 11155111 |                                              |
| Arbitrum Sepolia | 421614   |                                              |
| OP Sepolia       | 11155420 |                                              |

The listed factories only settle for the operator they were deployed with (see [deployments](/contracts/overview/#deployments)), so for your own server, [deploy a factory](/contracts/overview/#deploying-a-factory) with your operator wallet on each testnet you use.

## Getting test tokens

On Base Sepolia, Circle's faucet gives test USDC (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`), and most Base Sepolia faucets give test ETH for the operator's gas.
