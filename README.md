# Welcome to React Router + Cloudflare Workers!

### Dep Install
```bash
npm install
```

### Dev Server

```bash
npm run dev
```

@ `http://localhost:5173`.

## Typegen

Cloudflare bindings in `wrangler.json`:

```sh
npm run typegen
```

## Prod Build

Create a production build:

```bash
npm run build
```

## Previewing the Production Build

Preview the production build locally:

```bash

```

## Deployment

If you don't have a Cloudflare account, [create one here](https://dash.cloudflare.com/sign-up)! Go to your [Workers dashboard](https://dash.cloudflare.com/?to=%2F%3Aaccount%2Fworkers-and-pages) to see your [free custom Cloudflare Workers subdomain](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/) on `*.workers.dev`.

Once that's done, you can build your app:

```sh
npm run build
```

And deploy it:

```sh
npm run deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
