# Taking payments from your app

Most integrations look the same: your backend decides what's owed, the customer pays on the checkout, and your backend hears when it's paid.

<scalar-steps>

<scalar-step title="Your backend creates a payment link">

Create one for the order with [`@kite-01/sdk`](/integrate/sdk), with your order ID as its `reference`.

```ts
const { data: link } = await kite.paymentLinks.create({
  body: {
    title: "Pro plan",
    currency: "USD",
    amount: "49",
    reference: order.id,
  },
});
```

</scalar-step>

<scalar-step title="The customer pays on the checkout">

Send them to `/pay/<id>` on your Kite server, or on the [hosted instance](/hosted) you use. To keep them on your page, show it in an iframe instead; see [Checkout](/payments/checkout#on-your-own-page).

```ts
return Response.redirect(`https://pay.example.com/pay/${link.id}`);
```

![The checkout for a $49 Pro plan, asking how the customer would like to pay](/screenshots/checkout-method-single.png)

</scalar-step>

<scalar-step title="Kite calls your webhook">

When the payment settles, Kite calls your webhook. Your backend [verifies it](/integrate/webhooks), reads the `reference`, and fulfils the order.

</scalar-step>

</scalar-steps>

The price is always set on your server, where customers can't change it. The browser only opens a link that already exists, and only a verified webhook marks an order paid.

Agents can pay the same link: it's also an [x402](/payments/x402) resource, so an agent pays it over HTTP and your webhook hears about it like any other payment.

<scalar-grid cols="2">

<scalar-card title="@kite-01/sdk" href="/integrate/sdk">

Signed, typed calls to Kite.

</scalar-card>

<scalar-card title="Webhooks" href="/integrate/webhooks">

Know when payments settle.

</scalar-card>

<scalar-card title="Checkout" href="/payments/checkout">

What your customers see.

</scalar-card>

<scalar-card title="API Reference" href="/api-reference">

Every endpoint.

</scalar-card>

</scalar-grid>
