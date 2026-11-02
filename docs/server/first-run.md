# First run

With the server running, everything else happens in the dashboard. This walks through it in order. By the end you'll have a chain customers can pay on, an app, an API key and a payment link.

<scalar-steps>

<scalar-step title="Sign in">

Open your server's URL and sign in with your `KITE_ROOT_KEY`.

![The sign-in screen, asking for the root key](/screenshots/login.png)

</scalar-step>

<scalar-step title="Add provider keys">

Under **Providers**, add keys for the services you want: a deposit notifier, so payments settle the moment they land; a gas sponsor, so the operator wallet doesn't pay gas; and NEAR Intents, for [payouts](/payments/payouts). All of them are optional. [Providers](/server/providers) explains what changes without each.

![The Providers page, with each provider and the keys it needs](/screenshots/providers.png)

</scalar-step>

<scalar-step title="Deploy your Kite factory">

On each chain you'll take payments on, [deploy your own Kite factory](/contracts/overview#deploying-a-factory) with your server's operator wallet as its operator. The settings button in the dashboard shows the operator's address. Kite refuses a factory where its operator wallet isn't an operator.

</scalar-step>

<scalar-step title="Add a chain">

Under **Chains**, click **Add chain** and pick a network. The list only shows networks your server supports; a [testnet server](/server/testnets) shows testnets.

![The Add chain dialog with a network picker](/screenshots/chain-add.png)

</scalar-step>

<scalar-step title="Configure the chain">

Open the chain. In **Tokens**, add the tokens customers may pay with. Then, in **Configuration**, set your factory's address, the settlement token and the rest. [Chains and tokens](/server/chains-and-tokens) covers every field.

![A configured chain: factory address, settlement and USD-pegged tokens, slippage, RPC URLs and providers](/screenshots/chain-detail.png)

The chain shows as **Configured** once it has everything it needs.

![The Chains list, with one chain configured and another still needing configuration](/screenshots/chains.png)

</scalar-step>

<scalar-step title="Create an app">

Under **Apps**, create one for your business or project. Checkout shows its name, icon and links to customers. To receive every payment as one token on one chain, set a payout under **Additional information**; see [Payouts](/payments/payouts).

![Editing an app, with its payout token and address under Additional information](/screenshots/app-edit.png)

</scalar-step>

<scalar-step title="Turn on the app's chains">

Open the app and go to **Chains**. Turn on each chain the app accepts, with the address its payments settle to there. An app takes no payments until it accepts a chain.

![An app's Chains page: each configured chain, whether the app accepts it, and its address there](/screenshots/app-chains.png)

</scalar-step>

<scalar-step title="Create an API key">

Inside the app, go to **API keys** and create one for your backend. See [API keys](/authentication/api-keys).

</scalar-step>

<scalar-step title="Create a payment link and open it">

Under **Payment links**, create one, then use **Open checkout** to see the page your customers get.

![Checkout for the Team starter pack: line items and total on the left, payment options on the right](/screenshots/checkout-method.png)

</scalar-step>

</scalar-steps>

<scalar-callout type="info">

Inside an app, a banner at the top reminds you which app you're changing. **Back to apps** returns to the server-wide pages.

</scalar-callout>

## The overview

The dashboard's home shows the amount processed, settled transfers, customers, volume over time, top tokens and recent transfers. It covers the whole server or, inside an app, that app alone.

![The overview: amount processed, settled transfers, customers, volume chart, top tokens and recent transfers](/screenshots/overview.png)
