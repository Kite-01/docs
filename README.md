# Kite docs

The documentation site for [Kite](https://github.com/Kite-01/server): guides for running a server, taking payments, authentication and the npm packages. Each server serves its own API reference at `/openapi`.

Built with [Astro Starlight](https://starlight.astro.build).

## Development

Needs Node 22+ and pnpm 10.

```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # static site in dist/
pnpm lint
```

Pages live in `src/content/docs` as Markdown or MDX, and the sidebar is in `astro.config.mjs`. Screenshots go in `src/assets/screenshots`.

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
