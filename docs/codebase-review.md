# Codebase review

## Overview

This is a small, personal website built with React 19, React Router 7, Vite, and Cloudflare Workers. The structure is understandable at this scale: React UI and routes live in `app/`, the request handler and cursor-presence Durable Object live in `workers/`, and static content lives in `public/`.

The strongest foundations are strict TypeScript settings, generated route types, a clear Worker entry point, and a shared cursor protocol. The main improvement areas are keeping scripts and docs accurate, making active routes and prototypes easier to distinguish, and adding a small automated test and formatting baseline.

## Structure and behavior

- [`app/routes.ts`](../app/routes.ts) registers the home page and `/cv`. The home loader selects the cassette library for `cassettes.alexis.org.uk`; otherwise it shows the Wii-style menu.
- [`app/routes/WiiMenu.tsx`](../app/routes/WiiMenu.tsx) is an active component imported by the home route, rather than a separately registered route. [`app/routes/PixelDisplay.tsx`](../app/routes/PixelDisplay.tsx) appears to be a standalone experiment and is not registered.
- [`workers/app.ts`](../workers/app.ts) dispatches `/ws/*` requests to the cursor Durable Object and sends other requests through React Router. Cursor types and parsing are shared in [`workers/cursor-protocol.ts`](../workers/cursor-protocol.ts).
- [`public/`](../public) contains images and other static assets; `assets/fonts/` holds local font files.

This is a reasonable layout for a small site. As it grows, distinguish route entry points from reusable page components and experiments—for example, keep only registered route modules in `app/routes/` and place shared UI under `app/components/`. Avoid moving files solely to impose a larger architecture before that separation is useful.

## Findings and recommendations

### Fix first

1. **The `typecheck` script currently fails.** In [`package.json`](../package.json), it runs `npm run typegen`, but no `typegen` script exists. The available command is `cf-typegen`. Running `npm run typecheck` confirms the failure before TypeScript starts. Align the script name and README command, then run type generation and typechecking in a clean checkout.
2. **The README is still mostly framework-starter guidance.** [`README.md`](../README.md) has an empty preview command, describes deployment generically, and gives the nonexistent `npm run typegen` command. Replace it with this project's routes, host-based behavior, development/build/preview/typecheck/deployment commands, and Cloudflare setup.
3. **Cursor documentation is stale.** [`docs/cursor-system.md`](./cursor-system.md) says movement is sent at 10 per second, but [`workers/cursor-protocol.ts`](../workers/cursor-protocol.ts) configures 20. The document also links to an old absolute path on a developer machine. Update the rate and use repository-relative links.

### Improve next

4. **Clarify route modules versus experiments.** The active home route imports the Wii menu component from the route directory, while the pixel display module is not registered. This makes the route directory harder to interpret. Rename or relocate these modules when the area is next touched, and record which experiences are active.
5. **Scope CSS more narrowly.** [`app/routes/cs.css`](../app/routes/cs.css) uses global selectors such as `body`, `h1`, and `p`; [`app/routes/cassetteLibrary.css`](../app/routes/cassetteLibrary.css) also styles the document body. Global rules make route-specific styling capable of affecting other screens. Prefer CSS modules or page-scoped class selectors.
6. **Add a lightweight quality baseline.** There are no test files or test/lint/format scripts in the repository. Start with a formatter/linter and targeted tests for route selection and cursor-message parsing. The existing strict TypeScript configuration is a useful base, but does not check runtime behavior or formatting.

### Keep doing

- Keep [`workers/cursor-protocol.ts`](../workers/cursor-protocol.ts) as the shared source of cursor message types and limits; it reduces client/Worker drift.
- Keep Worker-specific code in `workers/`, static assets in `public/`, and generated Cloudflare types generated rather than hand-edited.
- Preserve the strict TypeScript settings and generated React Router route types.

## Suggested order

1. Fix and verify the typecheck/type-generation commands.
2. Replace the starter README and correct the cursor-system documentation.
3. Establish formatting/linting and a few focused tests.
4. Clarify active routes and scope page styles as those files are next changed.
