# Kite docs

The documentation site for [Kite](https://usekite.site), at [docs.usekite.site](https://docs.usekite.site): the hosted instances, running your own server, taking payments, authentication, the SDK, and the full API reference.

Built with [Fumadocs](https://fumadocs.dev) on Next.js, exported as a static site.

## Development

Needs Node 22+ and pnpm 10.

```sh
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # static site in out/
pnpm lint
```

Pages live in `content/docs` as MDX. Each folder's `meta.json` sets its sidebar title and page order; the root `content/docs/meta.json` orders the sections.

### The API reference

`content/docs/api-reference/` is generated from the server's OpenAPI spec in `openapi/kite.json`, one page per endpoint. Don't edit those pages; regenerate them when the API changes:

```sh
curl http://localhost:3000/openapi/json > openapi/kite.json   # from a running server
pnpm api
```

Keep the `servers` list in the spec (the hosted testnet and mainnet, and your own server) when you replace the file. Only `api-reference/index.mdx` is written by hand.

### Screenshots

Every screenshot in `public/screenshots` comes from a real Kite server. To take them all again, with the [server repo](https://github.com/Kite-01/server) checked out next to this one and `bun install` run in it:

```sh
pnpm screenshots
```

It starts a throwaway Postgres and a server in testnet mode with throwaway keys, seeds demo data (Acme Store, its payment links, customers and two weeks of transfers), captures the dashboard, the checkout on a desktop and a phone, and the server's API reference, then stops everything. Nothing is written outside `public/screenshots`. See `scripts/screenshots/` for the details, including the two shortcuts it takes because the throwaway operator wallet isn't an operator on the real testnet factory.

## Deploying

The site is static and deployed with Cloudflare Pages. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**, pick this repository, and set the following. Node's version comes from `.node-version`.

| Setting                | Value        |
| ---------------------- | ------------ |
| Production branch      | `main`       |
| Build command          | `pnpm build` |
| Build output directory | `out`        |

Add `docs.usekite.site` as a custom domain on the project. `public/_headers` sets the search index's content type and long cache lifetimes for built assets.

## Contributing

Corrections and new guides are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
