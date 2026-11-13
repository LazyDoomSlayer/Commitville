# 0001 — Browser-first static application

- Status: Accepted
- Date: 2026-11-13

## Context

Commitville must run unattended on a television powered by Raspberry Pi OS while remaining easy to test on ordinary computers. The initial simulation does not need accounts, shared server state, or remote writes.

## Decision

Build Commitville as a static browser application. Deploy the generic version to GitHub Pages and run it in Chromium kiosk mode on the Raspberry Pi. Do not introduce a required backend for the initial product.

## Consequences

- The same build works across Raspberry Pi, desktop, mobile, and modern smart-TV browsers.
- Hosting and recovery remain simple.
- Offline caching and browser persistence can keep the display useful during network interruptions.
- Private configuration must not be embedded in the public deployment.
- Server-owned features require a future decision rather than quietly expanding the static architecture.
