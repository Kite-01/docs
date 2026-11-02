# Apps

An app is a business, store or project that takes payments through your server. Everything a customer sees and everything your code touches belongs to an app:

- payment links, quotes and transfers
- customers
- API keys and webhooks
- the app's own fees

Chains, tokens, price feeds and the fees you set server-wide are shared by all apps.

![The Apps page](/screenshots/apps.png)

## Creating an app

Under **Apps**, create one with a name and, optionally, an icon URL, website, terms of service and privacy policy. Checkout shows the name and icon, and links to the website and policies. To receive every payment as one token on one chain, set a payout token and address under **Additional information**; see [Payouts](/payments/payouts).

Only the root key can create or list apps. Through the API, call `POST /api/apps` with the root key; see [Authentication](/authentication/overview).

## Chains and addresses

An app takes payments only on the chains it has turned on, each with the address its payments settle to there. Open the app and go to **Chains**:

![An app's Chains page: each configured chain, whether the app accepts it, and its address there](/screenshots/app-chains.png)

- New chains start off for every app.
- Quotes, checkout and x402 only offer the chains an app accepts.
- The address also receives NEAR Intents refunds of the app's payouts, and the app's fees that have no address of their own.

<scalar-callout type="warning">

These addresses receive real funds. Use wallets you control and can sign from, not exchange deposit addresses.

</scalar-callout>

Through the API, any key of the app can list its chains; changing them needs `App:Write`:

| Request                             | What it does                                                    |
| ----------------------------------- | --------------------------------------------------------------- |
| `GET /api/apps/chains`              | The chains the app accepts, with its address on each.           |
| `PUT /api/apps/chains/{chainId}`    | Accept a chain, or change the address: `{ "address": "0x…" }`. |
| `DELETE /api/apps/chains/{chainId}` | Stop accepting a chain.                                         |

## Inside an app

Open an app to work inside it. A banner across the top shows which app you're changing, and the sidebar switches to the app's pages.

![An app's transfers, with the banner showing the app being viewed](/screenshots/transfers.png)

An API key belongs to exactly one app, and can only see and change that app's data. With the root key, add an `x-kite-app-id` header to act as an app.

## Customers

Customers are optional. Create or update one by your own `externalId` with `POST /api/customers`, then attach it to a quote, and its name and traits show on the transfer. Fees can be conditioned on a customer or their traits.

![The Customers page, with each customer's external ID, name and traits](/screenshots/customers.png)
