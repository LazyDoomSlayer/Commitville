# Product vision

## One sentence

Commitville is a living pixel-art office that quietly tells stories on a shared screen without asking anyone to play it.

## Experience

The display should feel like looking through a window into a tiny workplace. Characters arrive, choose tasks, collaborate, drink coffee, lose focus, recover, react to incidents, and eventually go home. Small events should combine into stories that observers notice over time.

Commitville is ambient software:

- It starts automatically and requires no keyboard, mouse, or controller.
- A viewer can understand the current situation in a few seconds.
- Longer observation reveals patterns, relationships, and recurring jokes.
- The simulation continues safely after refreshes, network interruptions, and device restarts.
- The screen remains visually interesting without becoming distracting or noisy.

## Product principles

### Autonomous first

Characters make their own decisions from needs, schedules, roles, relationships, and world events. Manual controls may exist for debugging, but they are not the primary experience.

### Stories from systems

Prefer small interacting systems over long scripted sequences. Coffee, energy, task pressure, social needs, and interruptions should create events that feel authored without requiring every scene to be authored.

### Readable at television distance

Important state must survive a 1080p television, several meters of distance, and a room with changing light. Pixel art, text, contrast, and pacing must be designed for that environment.

### Local-first resilience

The deployed build should keep running when the internet disappears. Network features must enhance the simulation, not determine whether it boots.

### Fictional by default

The open-source project ships with fictional people and organizations. A private deployment may provide separate local configuration, but private identities never become public fixtures.

### Small, useful progress

Prefer a working room with one believable character over a grand design containing twenty unfinished systems. Track the reasoning and the small wins so the project records how it evolved.

## Initial audience

The first audience is an office team viewing Commitville on a shared television. The second is developers who want to fork the generic engine and create their own ambient workplace.

## Non-goals for the first release

- Direct player control
- Competitive scoring or monetization
- Real-time multiplayer
- A server requirement
- Photorealism or 3D rendering
- Employee monitoring or real productivity metrics
- Automatic ingestion of private workplace data
