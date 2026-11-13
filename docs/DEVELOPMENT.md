# Development workflow

## Requirements

- Node.js 24
- npm 11 or newer
- A current Chromium, Firefox, or Safari browser

Use the repository's `.nvmrc` when working with nvm:

```bash
nvm install
nvm use
npm install
```

## Run locally

```bash
npm run dev
```

Vite listens on all interfaces. This is intentional: it allows testing the development build from a Raspberry Pi or another device on the same trusted network. Do not expose the development server directly to the public internet.

## Quality checks

The complete local gate is:

```bash
npm run check
```

It runs linting, type-checking, unit tests, formatting verification, and the production build. CI runs the same responsibilities on every pull request and push to `main`.

## GitHub Pages

Merges to `main` build and deploy the generic public version through GitHub Actions. The workflow supplies `/Commitville/` as Vite's base path. Local and alternative deployments default to `/`.

Private configuration is never bundled into the GitHub Pages deployment.

## Raspberry Pi direction

The Pi is a display appliance, not the application server:

1. Raspberry Pi OS Desktop boots with automatic login.
2. Chromium opens the deployed URL in kiosk mode.
3. The browser cache keeps the last successful build available.
4. The kiosk process restarts after a browser crash or device reboot.

Exact kiosk provisioning will be added only after the web runtime is stable enough to test on the target Pi and television.

## Adding code

Use the ownership rules from `AGENTS.md`. If a file has no obvious owner, stop and clarify the responsibility before inventing a generic folder.

Tests live beside the code they verify. Simulation tests should avoid the DOM and Phaser runtime.
