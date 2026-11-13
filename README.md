# Commitville

Commitville is an autonomous pixel-art office simulation designed to run continuously on a shared display. It is not a game that waits for a player: its characters follow schedules, satisfy needs, collaborate, get distracted, and react to office events on their own.

The public project contains only fictional sample data and generic artwork. Real people, private company information, and organization-specific configuration do not belong in this repository.

## Status

Commitville is in its foundation phase. The current app proves the browser runtime, rendering loop, simulation clock, automated checks, and deployment pipeline.

## Stack

- TypeScript for application and simulation logic
- Phaser for 2D rendering and animation
- Vite for development and production builds
- Vitest for deterministic simulation tests
- ESLint and Prettier for automated code quality
- GitHub Actions and GitHub Pages for continuous delivery
- Chromium kiosk mode for the Raspberry Pi display

## Quick start

Requirements: Node.js 24 and npm 11 or newer.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. The development server listens on the local network so the app can also be tested from a Raspberry Pi or another device.

## Commands

```bash
npm run dev          # start the development server
npm run build        # type-check and create a production build
npm run test         # run unit tests once
npm run lint         # run ESLint
npm run format:check # verify formatting
npm run check        # run every CI check locally
```

## Documentation

- [Vision](docs/VISION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development workflow](docs/DEVELOPMENT.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture decisions](docs/decisions/README.md)
- [Contributing](CONTRIBUTING.md)

## Project philosophy

Commitville favors clear ownership over clever abstraction:

- Organize by responsibility first and domain second.
- Extract responsibilities, not lines of code.
- Keep tooling modular, readable, and easy to change.
- Record why decisions were made, not only what the final code does.
- Automate repetitive work while keeping the project understandable.

These principles are adapted from [Luka Jioshvili's development writing](https://dev.to/lazydoomslayer).

## License

No open-source license has been selected yet. The source is publicly visible, but no reuse rights are granted until a license is added.
