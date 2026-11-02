# Kite docs

The documentation for [Kite](https://github.com/Kite-01/server): the hosted instances, running your own server, taking payments, authentication, the SDK, and the full API reference.

Built with [Scalar Docs](https://scalar.com) and published from this repository through Scalar's GitHub sync.

## Layout

- `scalar.config.json`: the site's navigation. Every page needs a route here; a page without one isn't published.
- `docs/`: the pages, in Markdown with Scalar's components, such as `<scalar-callout>`, `<scalar-steps>` and `<scalar-tabs>`.
- `docs/assets/`: served from the site's root, so `docs/assets/screenshots/apps.png` is linked as `/screenshots/apps.png`.
- `openapi/kite.json`: the server's OpenAPI spec, shown as the API Reference.

## Preview

```sh
npx @scalar/cli project preview
npx @scalar/cli project check-config
```

The preview rebuilds when a file changes. If the API Reference stops loading after `openapi/kite.json` changes, restart the preview.

### The API reference

`openapi/kite.json` is generated from the server's routes. When the API changes, regenerate it:

The `servers` list (the hosted testnet and mainnet, and your own server) and the introduction in `info.description` are written by hand, and kept when the file is regenerated.
