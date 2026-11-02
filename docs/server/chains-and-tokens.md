# Chains and tokens

A chain is a network your server accepts payments on. Add it under **Chains**, list its tokens, then configure it. A chain that's added but not configured doesn't appear at checkout. The networks a server can offer are listed in the server's [chain registry](https://github.com/Kite-01/server/blob/main/src/shared/chains/registry.ts).

## Tokens

In the chain's **Tokens** tab, add each token customers may pay with by its contract address. Kite reads its name, symbol and decimals from the chain, and its icon where one is known. Use the pencil next to a token to change its icon.

![The Tokens tab of a chain, listing USDC and WETH](/screenshots/chain-tokens.png)

Customers can pay with any listed token. Tokens other than the settlement token are swapped when the payment settles, so each needs a Uniswap pool with the settlement token: V3 where the chain has Uniswap V3, or a V2 pair where it doesn't. A customer can also paste in any other token's address at checkout; it's priced the same way, if a pool exists.

## Configuration

![The configuration form of a chain](/screenshots/chain-detail.png)

| Field                   | What it does                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **KiteFactory address** | Your own Kite factory on this network, with your server's operator as its operator. See [deploying a factory](/contracts/overview#deploying-a-factory). |
| **Settlement token**    | What payments are settled in, such as USDC. Add it in Tokens first.                                                                     |
| **USD-pegged token**    | A token worth $1, used to value payments in USD for quotes, fees and stats. Usually the same USDC.                                      |
| **Slippage**            | How far, in basis points, a swap may fall short of the quoted price. `100` is 1%.                                                       |
| **Max gas price**       | Optional ceiling, in wei, on the gas price the operator will pay.                                                                       |
| **RPC URLs**            | Your own RPC endpoints, one per line. Public RPCs are used as a fallback, but they're rate-limited, so use your own in production.      |
| **Deposit notifiers**   | Optional. Which [providers](/server/providers) watch this chain for deposits. Only providers with keys set, and that support the chain, can be used. |
| **Gas sponsors**        | Optional. Which provider pays the operator's gas on this chain.                                                                          |

Where payments settle isn't part of the chain: each app sets its own address on every chain it accepts. See [Apps](/payments/apps).

## What a chain can do

What Kite can do on a chain depends on the providers that support it:

- **On chains without a deposit notifier**, deposits are found by a balance check every minute, and deposit webhooks aren't sent.
- **On chains without a gas sponsor**, the operator wallet pays the gas.
- **On chains NEAR Intents doesn't support**, payments settle to the app's address on that chain, even when the app has a [payout](/payments/payouts) set.
- **On chains whose settlement token doesn't support EIP-3009**, there's no [x402](/payments/x402), so agents can't pay there.

## Pricing

Quotes for tokens other than the settlement token come from Uniswap time-weighted average prices, not the pools' spot price, so a single trade can't move a quote. For each pair, Kite averages the price over the last 10 minutes (falling back to 5, then 1, for pools with less history). On Uniswap V3 it reads every fee tier's pool and prices from the deepest. The swap then uses that pool, and the slippage setting protects the settlement if the spot price has moved away from the average.

## Currencies

Payment links can be priced in USD out of the box. To price in another currency, add a Chainlink price feed for it under **Price feeds**. Its pair and decimals are read from the contract, and the currency becomes available once a feed quotes it in USD.

## Turning a chain off

The **Active** switch hides a chain from checkout without losing its configuration.
