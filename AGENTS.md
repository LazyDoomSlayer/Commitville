# AGENTS.md

This file defines how coding agents should work in Commitville. It applies to the entire repository.

## Start here

Before changing code, read:

1. `docs/VISION.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DEVELOPMENT.md`
4. Any architecture decision relevant to the change

Keep work on a focused branch and deliver it through a pull request. Never push feature work directly to `main`.

## Product boundaries

- Commitville is an autonomous ambient simulation, not a player-driven game.
- The primary runtime is a Chromium kiosk on a 1080p television.
- The browser build must also work on current desktop and mobile browsers.
- The simulation must remain understandable when observed without controls or instructions.
- Public fixtures must be fictional. Never commit real employee data, private company details, credentials, internal URLs, or identifiable private artwork.

## Engineering principles

The project adapts the owner's documented engineering approach:

- **Responsibility first, domain second.** Top-level source folders describe what code owns. Within them, group by simulation domain or feature.
- **Ownership before placement.** Ask “who owns this?” before choosing a folder.
- **Extract responsibility, not lines.** Do not create an abstraction only because a file is long. Extract code when it owns a behavior that can be described in one sentence.
- **Prefer proven sharing.** Small duplication is cheaper than a premature shared abstraction.
- **External communication belongs to services.** Rendering scenes and simulation systems must not fetch remote data directly.
- **Transparent tooling.** Scripts and configuration should be readable, modular, and replaceable.
- **Document the journey.** Record meaningful trade-offs and reversals in an ADR so future contributors know why the code looks this way.
- **Automate the boring work.** CI should enforce repeatable checks; human review should focus on behavior and design.

## Ownership map

- `src/simulation/` owns deterministic world state and behavior. It must not import Phaser or browser DOM APIs.
- `src/rendering/` owns Phaser scenes, sprites, cameras, effects, and visual projection of simulation state.
- `src/services/` owns persistence and external communication when those capabilities are introduced.
- `src/ui/` owns browser UI outside the Phaser canvas when it becomes large enough to deserve a module.
- `src/main.ts` owns composition and application lifecycle, not domain rules.
- `public/` owns generic public assets and example configuration only.
- `docs/decisions/` owns architectural decision records.

## Naming

Use names that reveal responsibility before a file is opened:

- `*.scene.ts` for Phaser scenes
- `*.system.ts` for simulation systems
- `*.service.ts` for persistence or external communication
- `*.config.ts` for configuration builders
- `*.types.ts` for shared contracts with no runtime behavior
- `*.test.ts` next to the code it verifies

Avoid generic dumping grounds such as `utils/`, `helpers/`, or `common/`. Name the owned behavior instead.

## Change rules

- Keep simulation logic deterministic where practical. Inject time and randomness rather than reading global values inside domain code.
- Preserve pixel-art rendering: no smoothing or fractional sprite positioning unless the visual design explicitly requires it.
- Design for unattended recovery. A runtime error must not leave the TV on a blank screen.
- Do not add a UI framework, backend, database, analytics, or network dependency without an ADR.
- Do not add real team configuration to the public repository. Use ignored local files described in `docs/PRIVACY.md`.
- Never commit Pixelwood Valley or other licensed art-pack files. Use the private asset preparation workflow in `docs/ASSETS.md`.
- Pixelwood Valley may be organized and integrated by agents, but must not be used as input or imitation reference for generative artwork.
- Keep dependencies few and explain substantial additions in the PR.
- Update documentation when behavior, commands, architecture, or deployment changes.

## Verification

Run this before requesting review:

```bash
npm run check
```

For visual changes, also run the development server and inspect at least:

- 1920×1080, the target television layout
- 1280×720, the fallback display layout
- A narrow mobile viewport, to catch overflow and scaling failures

Add or update tests when changing simulation rules. A PR must not weaken checks simply to make them pass.

## Pull requests

- Use a focused branch such as `feat/character-needs` or `fix/clock-rollover`. Agent-created branches use the `codex/` prefix.
- Prefer small, reviewable PRs that leave the project runnable.
- Explain the user-visible outcome, ownership decisions, verification, and follow-up work.
- Include screenshots or recordings for visual changes when practical.
- Link or add an ADR for decisions that constrain future work.
