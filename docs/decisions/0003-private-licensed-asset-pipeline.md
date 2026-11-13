# 0003 — Private licensed asset pipeline

- Status: Accepted
- Date: 2026-11-13

## Context

Commitville is public source, while its target visual prototype uses purchased Pixelwood Valley assets that cannot be redistributed as an asset pack. The generic project and GitHub Pages deployment must work without access to those files. The Raspberry Pi deployment still needs a repeatable way to include licensed runtime assets.

## Decision

Store purchased source packs under the ignored `private/assets/` tree. Use a committed preparation script to copy only a curated runtime subset into the ignored `public/assets/private/` cache and generate a validated manifest.

The application loads the manifest when present and otherwise renders a generic fallback. Public CI and GitHub Pages run from a clean checkout without private assets. Private Raspberry Pi builds are produced locally.

Do not use Pixelwood Valley as an input or imitation reference for generative artwork. Agent work is limited to programming, documentation, organization, and technical integration of the licensed files.

## Consequences

- Purchased source art cannot enter Git history through the intended workflow.
- Public contributors can build and test Commitville without owning the pack.
- Private builds remain repeatable on the target device.
- Generated `dist/` artifacts that contain licensed files must be handled as private game builds, not source distributions.
- New licensed packs require explicit provenance, restrictions, and a curated preparation mapping.
