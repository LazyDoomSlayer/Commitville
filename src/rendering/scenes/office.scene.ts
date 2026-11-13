import Phaser from 'phaser';

const COLORS = {
  wall: 0x22313d,
  floor: 0x2d4450,
  floorLine: 0x35515e,
  desk: 0xb06b3f,
  deskEdge: 0x70432f,
  monitor: 0x14222b,
  monitorGlow: 0x77e6b6,
  plant: 0x55a66f,
  coffee: 0xf0bf6a,
} as const;

export class OfficeScene extends Phaser.Scene {
  constructor() {
    super('office');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.wall);
    this.drawFoundationOffice();

    this.scale.on('resize', () => {
      this.scene.restart();
    });
  }

  private drawFoundationOffice(): void {
    const { width, height } = this.scale;
    const graphics = this.add.graphics();
    const roomX = Math.max(24, width * 0.08);
    const roomY = Math.max(110, height * 0.2);
    const roomWidth = width - roomX * 2;
    const roomHeight = height - roomY - Math.max(36, height * 0.08);

    graphics.fillStyle(COLORS.floor, 1);
    graphics.fillRect(roomX, roomY, roomWidth, roomHeight);

    graphics.lineStyle(1, COLORS.floorLine, 0.55);
    for (let x = roomX; x <= roomX + roomWidth; x += 32) {
      graphics.lineBetween(x, roomY, x, roomY + roomHeight);
    }
    for (let y = roomY; y <= roomY + roomHeight; y += 32) {
      graphics.lineBetween(roomX, y, roomX + roomWidth, y);
    }

    const centerX = width / 2;
    const centerY = roomY + roomHeight / 2;
    if (roomWidth >= 700) {
      this.drawDesk(graphics, centerX - 190, centerY - 70);
      this.drawDesk(graphics, centerX + 30, centerY - 70);
      this.drawDesk(graphics, centerX - 190, centerY + 90);
      this.drawDesk(graphics, centerX + 30, centerY + 90);
    } else {
      this.drawDesk(graphics, centerX - 78, centerY - 96);
      this.drawDesk(graphics, centerX - 78, centerY + 74);
    }

    graphics.fillStyle(COLORS.plant, 1);
    graphics.fillCircle(roomX + 44, roomY + 44, 18);
    graphics.fillCircle(roomX + 68, roomY + 52, 14);

    graphics.fillStyle(COLORS.coffee, 1);
    graphics.fillRect(roomX + roomWidth - 92, roomY + 28, 48, 62);

    const statusY = roomWidth >= 700 ? centerY + 8 : roomY + roomHeight - 70;
    const statusWidth = Math.max(120, roomWidth - 32);

    this.add
      .text(centerX, statusY, 'THE OFFICE IS BOOTING UP', {
        color: '#d7fbe8',
        fontFamily: 'monospace',
        fontSize: roomWidth >= 700 ? '16px' : '11px',
        letterSpacing: 2,
        align: 'center',
        wordWrap: { width: statusWidth },
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, statusY + 30, 'characters arrive in the next milestone', {
        color: '#86a8b5',
        fontFamily: 'monospace',
        fontSize: roomWidth >= 700 ? '12px' : '9px',
        align: 'center',
        wordWrap: { width: statusWidth },
      })
      .setOrigin(0.5);
  }

  private drawDesk(graphics: Phaser.GameObjects.Graphics, x: number, y: number): void {
    graphics.fillStyle(COLORS.deskEdge, 1);
    graphics.fillRect(x + 4, y + 8, 156, 62);
    graphics.fillStyle(COLORS.desk, 1);
    graphics.fillRect(x, y, 156, 58);
    graphics.fillStyle(COLORS.monitor, 1);
    graphics.fillRect(x + 52, y + 10, 54, 30);
    graphics.fillStyle(COLORS.monitorGlow, 0.8);
    graphics.fillRect(x + 57, y + 15, 44, 20);
  }
}
