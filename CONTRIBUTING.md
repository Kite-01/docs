# Contributing

Thanks for helping with Kite's docs. Found a security issue? Don't open an issue or pull request; follow the [security policy](https://github.com/Kite-01/server/blob/main/SECURITY.md).

## Setup

You need Node.js 22 or newer and pnpm 10.

```sh
pnpm install
pnpm dev
```

## Making a change

1. Fork the repo and branch from `main`.
2. Edit or add pages in `src/content/docs`. A new page also needs an entry in the sidebar in `astro.config.mjs`.
3. Check what you write against the code. If a guide describes behaviour, it should match the [server](https://github.com/Kite-01/server) or [packages](https://github.com/Kite-01/monorepo) as they are on `main`.
4. Run the checks; both must pass:

   ```sh
   pnpm lint
   pnpm build
   ```

   `pnpm format` fixes formatting.

5. Open a pull request saying what changed and why.

## Writing

- Write for someone setting up or integrating Kite for the first time. Say what to do, then why, briefly.
- Keep examples runnable: real package names, real headers, real endpoints.
- Screenshots are PNGs at 2x, taken from a dashboard with realistic data, saved in `src/assets/screenshots`. Don't include real keys or addresses you care about.
