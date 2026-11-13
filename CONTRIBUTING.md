# Contributing to Commitville

Commitville grows through small, reviewable pull requests. Every change should keep the simulation runnable and make its ownership clearer.

## Local setup

```bash
nvm use
npm install
npm run dev
```

## Branch workflow

1. Update `main` and create a focused branch.
2. Use `feat/`, `fix/`, `docs/`, `chore/`, or `codex/` as the branch prefix.
3. Make one coherent change.
4. Run `npm run check`.
5. Push the branch and open a pull request.
6. Merge only after CI passes and the change is reviewed.

Use conventional commit subjects where they improve clarity:

```text
feat: add character energy system
fix: preserve clock state after reload
docs: record navigation decision
chore: update rendering dependencies
```

## Architecture expectations

Before adding a file, ask who owns it. Follow the map in `AGENTS.md` and the boundaries in `docs/ARCHITECTURE.md`.

Do not introduce an abstraction only to reduce a file's line count. A new module should own one clear responsibility that can be explained in a sentence.

## Public-data rule

Contributions must use fictional characters and generic data. Do not include real employee names, likenesses, schedules, employers, client information, internal domains, tokens, or non-public assets. See `docs/PRIVACY.md`.

## Pull request checklist

- The change has a clear owner and respects layer boundaries.
- Tests cover changed simulation behavior.
- `npm run check` passes locally.
- Documentation reflects changed behavior or architecture.
- Visual changes were checked at the target display sizes.
- No private or identifying information is present.
