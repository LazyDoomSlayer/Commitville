import { describe, expect, it } from 'vitest';

import { WorldClock } from './world-clock';

describe('WorldClock', () => {
  it('advances game time at the configured speed', () => {
    const clock = new WorldClock({
      startDay: 0,
      startMinute: 8 * 60,
      gameMinutesPerRealSecond: 2,
    });

    expect(clock.advance(30_000)).toEqual({
      day: 'MON',
      dayNumber: 0,
      hour: 9,
      minute: 0,
    });
  });

  it('rolls into the next weekday', () => {
    const clock = new WorldClock({
      startDay: 4,
      startMinute: 23 * 60 + 59,
    });

    expect(clock.advance(1_000)).toEqual({
      day: 'SAT',
      dayNumber: 5,
      hour: 0,
      minute: 0,
    });
  });

  it('preserves fractional game minutes between updates', () => {
    const clock = new WorldClock({ gameMinutesPerRealSecond: 0.5 });

    clock.advance(1_000);

    expect(clock.advance(1_000).minute).toBe(1);
  });
});
