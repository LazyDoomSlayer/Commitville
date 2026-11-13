# 0002 — Phaser, TypeScript, and Vite

- Status: Accepted
- Date: 2026-11-13

## Context

The project needs efficient 2D rendering, pixel-art support, scenes, sprite animation, tilemaps, and a fast browser development workflow. Its simulation rules should remain testable without launching a renderer.

## Decision

Use Phaser 4 for presentation, strict TypeScript for application and simulation code, and Vite for development and production builds. Keep simulation modules independent from Phaser.

Do not add a general UI framework at foundation stage. Use the DOM for the small display shell and reconsider only when UI behavior develops a clear independent responsibility.

## Consequences

- Rendering features do not need to be built from low-level canvas primitives.
- Strict contracts make autonomous behavior and save formats easier to evolve safely.
- Simulation tests stay fast because domain code has no renderer dependency.
- Phaser upgrades and browser GPU compatibility must be tested on the target Raspberry Pi.
- If the DOM interface grows, adding a UI framework requires a separate ADR.
