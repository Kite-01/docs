# Kite

Kite gives you payment links and a checkout for crypto. You create a link with a price, your customer pays it in any token on a chain you accept, and a Kite contract settles the payment on-chain. Your systems hear about it through a signed webhook.

![The Kite dashboard: amount processed, settled transfers, volume and recent transfers](/screenshots/overview.png)

## Why Kite

- **Agents can pay you.** A checkout built for people can't take an AI agent's payment. Every Kite payment link is also an [x402](/payments/x402) resource, which an agent pays with an HTTP request.
- **You get paid in one place.** A payment settles to your address on the chain it was paid on, or arrives as one token on one chain, such as USDC on NEAR, through [NEAR Intents](/payments/payouts).

## Two ways to use it

<scalar-grid cols="2">

<scalar-card title="Hosted Kite" href="/hosted">

Kite's own testnet and mainnet instances. No server to run, and Kite pays you out.

</scalar-card>

<scalar-card title="Run your own server" href="/server/install">

The server is open source: one Docker image, your chains, settled to your own addresses.

</scalar-card>

</scalar-grid>

Both run the same dashboard, checkout and API, so everything under [Payments](/payments/payment-links), [Authentication](/authentication/overview) and [Integrate](/integrate/overview) applies to either.

## Where to go next

<scalar-grid cols="2">

<scalar-card title="How Kite works" href="/how-kite-works">

The pieces, and what happens when a customer pays.

</scalar-card>

<scalar-card title="Take payments from your app" href="/integrate/overview">

Create links on your server and hear when they settle.

</scalar-card>

<scalar-card title="Checkout" href="/payments/checkout">

What your customers see, and how they pay.

</scalar-card>

<scalar-card title="API Reference" href="/api-reference">

Every endpoint, with its request and response.

</scalar-card>

</scalar-grid>
