# Assets and licensing

Commitville supports a generic public build and a richer private build that uses locally purchased assets. The public repository must remain useful without licensed files.

## Pixelwood Valley

The private visual prototype uses Pixelwood Valley v1.1.4 by Gowl:

- Source: <https://gowldev.itch.io/pixelwood-valley>
- License tier: Premium
- Purpose: game runtime environment, furniture, plants, and fictional NPC sprites

The license permits use and modification in personal and commercial games. It does not permit reselling, redistributing, or sharing the original or modified assets as an asset pack. It also prohibits AI-training datasets and NFT projects.

The creator has separately clarified that AI assistants may help with programming, documentation, asset organization, and technical integration, but the artwork must not be used to train or produce AI-generated artwork. Commitville follows that restriction.

## Donarg Office Interior Tileset

The private office composition uses the Office Interior Tileset by Donarg:

- Source: <https://donarg.itch.io/office>
- Archive SHA-256: `1b1f6ff8c52d2c4be953a4bb203fbcd8a53fb6cbb1ed64b768e400dfa452d091`
- Purpose: modern office walls, floors, desks, computers, chairs, meeting areas, appliances, screens, and decorations

The license bundled in the purchased archive permits editing and use in commercial and non-commercial projects. It prohibits resale or redistribution, web3/NFT/crypto/blockchain projects, and AI or machine-learning training. Credit to Donarg is optional and appreciated.

The initial private preview uses the bundled Level 3 composition as a temporary office layout and overlays fictional Pixelwood NPCs. The 16×16 atlas is also prepared for the custom photo-based map that will replace the sample layout.

## Local source layout

Extract the purchased pack into this ignored location:

```text
private/assets/pixelwood-valley/
└── Pixelwood Valley 1.1.4/
    ├── interior/
    ├── NPCs/
    └── ...

private/assets/donarg-office/
└── Office Tileset/
    ├── Office Tileset All 16x16.png
    ├── LICENSE.txt
    └── Office Designs/
```

Alternative extractions can be supplied temporarily with `PIXELWOOD_ASSET_ROOT` and `DONARG_ASSET_ROOT`.

## Runtime preparation

Run:

```bash
npm run assets:prepare
```

The preparation script discovers either or both supported packs, validates their expected markers, clears only the generated `public/assets/private/` cache, copies each curated runtime subset, and writes a manifest. It never modifies a purchased source directory.

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
