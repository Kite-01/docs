# Kite docs

The documentation for [Kite](https://github.com/Kite-01/server): the hosted instances, running your own server, taking payments, authentication, the SDK, and the full API reference.

Built with [Fern](https://buildwithfern.com). The Fern Dashboard publishes it from this repository on every push.

## Layout

Everything Fern reads is in `fern/`:

- `docs.yml`: the site's navigation, logo, colours and links. A page needs an entry here to be published.
- `fern.config.json`: the Fern organization and the CLI version that builds the site.
- `pages/`: the pages, in MDX with Fern's components, such as `<Info>`, `<Steps>` and `<Tabs>`.
- `assets/`: images and icons. Pages link them from the `fern` folder, so `fern/assets/screenshots/apps.png` is `/assets/screenshots/apps.png`.
- `openapi/kite.json`: the server's OpenAPI spec, shown as the API Reference. Its introduction is `pages/api-reference.mdx`.

## Preview

Needs Node and pnpm.

```sh
npx fern-api docs dev        # http://localhost:3000
npx fern-api check
```

The preview reloads when a file changes.

### The API reference

When the API changes, replace `fern/openapi/kite.json` with the spec from a running server, at `/openapi/json`. Keep its `servers` list (the hosted testnet and mainnet, and your own server).
