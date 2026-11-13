# Assets and licensing

Commitville supports a generic public build and a richer private build that uses locally purchased assets. The public repository must remain useful without licensed files.

## Pixelwood Valley

The private visual prototype uses Pixelwood Valley v1.1.4 by Gowl:

- Source: <https://gowldev.itch.io/pixelwood-valley>
- License tier: Premium
- Purpose: game runtime environment, furniture, plants, and fictional NPC sprites

The license permits use and modification in personal and commercial games. It does not permit reselling, redistributing, or sharing the original or modified assets as an asset pack. It also prohibits AI-training datasets and NFT projects.

The creator has separately clarified that AI assistants may help with programming, documentation, asset organization, and technical integration, but the artwork must not be used to train or produce AI-generated artwork. Commitville follows that restriction.

## Local source layout

Extract the purchased pack into this ignored location:

```text
private/assets/pixelwood-valley/
└── Pixelwood Valley 1.1.4/
    ├── interior/
    ├── NPCs/
    └── ...
```

An alternative extraction can be supplied temporarily with `PIXELWOOD_ASSET_ROOT`.

## Runtime preparation

Run:

```bash
npm run assets:prepare
```

The preparation script validates the expected pack marker, clears only the generated `public/assets/private/` cache, copies the curated runtime subset, and writes a manifest. It never modifies the purchased source directory.

The cache and the resulting private `dist/` build are local deployment artifacts. Do not add either to Git.

## Public fallback

When the private manifest is absent, Commitville renders its generic code-created placeholder office. GitHub Pages always uses this fallback because CI runs from a clean public checkout.

## Adding another pack

Before integrating another licensed pack:

1. Record its creator, source, version, license tier, and restrictions.
2. Keep source assets under `private/assets/`.
3. Copy only the files needed at runtime.
4. Preserve a functional public fallback.
5. Do not mix packs until their scale, perspective, palette, and license are verified.
