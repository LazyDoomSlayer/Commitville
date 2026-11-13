import Phaser from 'phaser';

import { createGameConfig } from './rendering/config/game.config';
import { WorldClock } from './simulation/time/world-clock';
import './styles/main.css';

const clockElement = document.querySelector<HTMLTimeElement>('#world-clock');

if (!clockElement) {
  throw new Error('The world clock element is missing from the application shell.');
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
const game = new Phaser.Game(createGameConfig('game'));

window.addEventListener(
  'pagehide',
  () => {
    window.clearInterval(clockTimer);
    game.destroy(true);
  },
  { once: true },
);
