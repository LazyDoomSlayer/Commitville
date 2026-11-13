import Phaser from 'phaser';

import { createGameConfig } from './rendering/config/game.config';
import { loadPrivateAssets } from './services/assets/private-assets.service';
import { WorldClock } from './simulation/time/world-clock';
import './styles/main.css';

const clockElement = document.querySelector<HTMLTimeElement>('#world-clock');
const artCreditElement = document.querySelector<HTMLParagraphElement>('#art-credit');

if (!clockElement || !artCreditElement) {
  throw new Error('The application shell is missing a required display element.');
}

const privateAssets = await loadPrivateAssets();

if (privateAssets) {
  const pack = privateAssets.packs.pixelwoodValley;
  artCreditElement.textContent = `ART: ${pack.title.toUpperCase()} · ${pack.creator.toUpperCase()}`;
  artCreditElement.hidden = false;
}

const worldClock = new WorldClock({
  startDay: 0,
  startMinute: 8 * 60,
  gameMinutesPerRealSecond: 2,
});

const updateClock = (): void => {
  const snapshot = worldClock.advance(1_000);
  clockElement.textContent = worldClock.format(snapshot);
  clockElement.dateTime = `P${snapshot.dayNumber}DT${snapshot.hour}H${snapshot.minute}M`;
};

clockElement.textContent = worldClock.format(worldClock.snapshot());

const clockTimer = window.setInterval(updateClock, 1_000);
const game = new Phaser.Game(createGameConfig('game', privateAssets));

window.addEventListener(
  'pagehide',
  () => {
    window.clearInterval(clockTimer);
    game.destroy(true);
  },
  { once: true },
);
