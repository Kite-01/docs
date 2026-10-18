import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://kite-docs.pages.dev",
  integrations: [
    starlight({
      title: "Kite",
      description:
        "Run your own crypto payment processor: payment links, checkout, webhooks and on-chain settlement.",
      logo: {
        light: "./src/assets/icon.svg",
        dark: "./src/assets/icon-dark.svg",
      },
      favicon: "/favicon.svg",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Kite-01",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/Kite-01/docs/edit/main/",
      },
      customCss: ["./src/styles/theme.css"],
      sidebar: [
        {
          label: "Start here",
          items: ["index", "how-kite-works"],
        },
        {
          label: "Run a server",
          items: [
            "server/install",
            "server/configuration",
            "server/first-run",
            "server/providers",
            "server/chains-and-tokens",
            "server/testnets",
            "server/production",
          ],
        },
        {
          label: "Payments",
          items: [
            "payments/apps",
            "payments/payment-links",
            "payments/checkout",
            "payments/transfers",
            "payments/fees",
            "payments/refunds-and-recovery",
            "payments/x402",
          ],
        },
        {
          label: "Authentication",
          items: [
            "authentication/overview",
            "authentication/api-keys",
            "authentication/signing-requests",
          ],
        },
        {
          label: "Integrate",
          items: [
            "integrate/overview",
            "integrate/sdk",
            "integrate/checkout-js",
            "integrate/webhooks",
          ],
        },
        {
          label: "Contracts",
          items: ["contracts/overview"],
        },
        {
          label: "API Reference",
          items: ["api-reference"],
        },
      ],
    }),
  ],
});
