const MINUTES_PER_DAY = 24 * 60;
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export interface WorldClockOptions {
  startDay?: number;
  startMinute?: number;
  gameMinutesPerRealSecond?: number;
}

export interface WorldTime {
  day: (typeof DAYS)[number];
  dayNumber: number;
  hour: number;
  minute: number;
}

export class WorldClock {
  private totalMinutes: number;
  private fractionalMinutes = 0;
  private readonly gameMinutesPerRealSecond: number;

  constructor(options: WorldClockOptions = {}) {
    const startDay = options.startDay ?? 0;
    const startMinute = options.startMinute ?? 0;
    const speed = options.gameMinutesPerRealSecond ?? 1;

    if (!Number.isInteger(startDay) || startDay < 0) {
      throw new RangeError('startDay must be a non-negative integer.');
    }
    if (!Number.isInteger(startMinute) || startMinute < 0 || startMinute >= MINUTES_PER_DAY) {
      throw new RangeError('startMinute must be an integer between 0 and 1439.');
    }
    if (!Number.isFinite(speed) || speed <= 0) {
      throw new RangeError('gameMinutesPerRealSecond must be greater than zero.');
    }

    this.totalMinutes = startDay * MINUTES_PER_DAY + startMinute;
    this.gameMinutesPerRealSecond = speed;
  }

  advance(realMilliseconds: number): WorldTime {
    if (!Number.isFinite(realMilliseconds) || realMilliseconds < 0) {
      throw new RangeError('realMilliseconds must be a non-negative finite number.');
    }

    const elapsedGameMinutes =
      (realMilliseconds / 1_000) * this.gameMinutesPerRealSecond + this.fractionalMinutes;
    const wholeMinutes = Math.floor(elapsedGameMinutes);

    this.fractionalMinutes = elapsedGameMinutes - wholeMinutes;
    this.totalMinutes += wholeMinutes;

    return this.snapshot();
  }

  snapshot(): WorldTime {
    const dayNumber = Math.floor(this.totalMinutes / MINUTES_PER_DAY);
    const minuteOfDay = this.totalMinutes % MINUTES_PER_DAY;
    const day = DAYS[dayNumber % DAYS.length];

    if (!day) {
      throw new Error('World clock resolved an invalid weekday.');
    }

    return {
      day,
      dayNumber,
      hour: Math.floor(minuteOfDay / 60),
      minute: minuteOfDay % 60,
    };
  }

  format(time: WorldTime): string {
    const hour = String(time.hour).padStart(2, '0');
    const minute = String(time.minute).padStart(2, '0');

    return `${time.day} ${hour}:${minute}`;
  }
}
