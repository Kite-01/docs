# Kite docs

The documentation site for [Kite](https://github.com/Kite-01/server): guides for running a server, taking payments, authentication, the npm packages, and a versioned API reference.

Built with [Astro Starlight](https://starlight.astro.build). The API reference is [Scalar](https://github.com/scalar/scalar), rendered from each server version's OpenAPI spec.

## Development

Needs Node 22+ and pnpm 10.

```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # static site in dist/
pnpm lint
```

Pages live in `src/content/docs` as Markdown or MDX, and the sidebar is in `astro.config.mjs`. Screenshots go in `src/assets/screenshots`.

## API reference versions

Each server release gets its own spec in `public/api`, and the reference has a version switcher. To add a version, point the script at a running server or at the output of `bun run spec` from a server checkout:

```sh
pnpm spec:add https://pay.example.com/openapi/json
# or: pnpm spec:add ../server/kite.json
```

It reads `info.version`, writes `public/api/<version>.json` and lists the version in `src/api-versions.json`, newest first. The newest is shown by default. Running it again for an existing version replaces that spec.

## Deploying

The site is static and deployed with Cloudflare Pages. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**, pick this repository, and set the following. Node's version comes from `.node-version`.

| Setting                | Value        |
| ---------------------- | ------------ |
| Production branch      | `main`       |
| Build command          | `pnpm build` |
| Build output directory | `dist`       |

Every push to `main` deploys to `<project>.pages.dev`, and pull requests get preview URLs. If the project name isn't `kite-docs`, update `site` in `astro.config.mjs` to match, or to your own domain once you add one.

## Contributing

Corrections and new guides are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
