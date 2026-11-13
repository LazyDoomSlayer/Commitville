import type Phaser from 'phaser';

const DESIGN_WIDTH = 704;
const DESIGN_HEIGHT = 464;

const COLORS = {
  outside: 0x241f21,
  balcony: 0x8fa9a9,
  balconyLine: 0x657b7f,
  wall: 0xf2eee8,
  wallEdge: 0x342e31,
  floor: 0x9db7b5,
  floorLine: 0x8aa5a4,
  glass: 0x9ed9e0,
  glassLight: 0xd7f5f2,
  screen: 0x93e5dc,
  screenEdge: 0x243137,
  sign: 0xf7f2df,
  signText: '#5e4f4c',
} as const;

const ATLAS_CROPS = {
  workstation: { x: 16, y: 0, width: 48, height: 32 },
  chair: { x: 0, y: 256, width: 16, height: 16 },
  door: { x: 16, y: 288, width: 16, height: 48 },
  window: { x: 32, y: 336, width: 32, height: 16 },
  plant: { x: 32, y: 448, width: 16, height: 32 },
} as const;

type WallSide = 'left' | 'right' | 'bottom';

interface StationLayout {
  side: WallSide;
  x: number;
  y: number;
}

const STATIONS: ReadonlyArray<StationLayout> = [
  { side: 'left', x: 70, y: 148 },
  { side: 'left', x: 70, y: 256 },
  { side: 'left', x: 70, y: 364 },
  { side: 'right', x: 634, y: 148 },
  { side: 'right', x: 634, y: 256 },
  { side: 'right', x: 634, y: 364 },
  { side: 'bottom', x: 112, y: 394 },
  { side: 'bottom', x: 232, y: 394 },
  { side: 'bottom', x: 472, y: 394 },
  { side: 'bottom', x: 592, y: 394 },
];

export interface DonargOfficeRendererOptions {
  scene: Phaser.Scene;
  atlasTexture: string;
  npcTextures: ReadonlyArray<string>;
}

export class DonargOfficeRenderer {
  private readonly scene: Phaser.Scene;
  private readonly atlasTexture: string;
  private readonly npcTextures: ReadonlyArray<string>;
  private readonly scale: number;
  private readonly left: number;
  private readonly top: number;

  constructor(options: DonargOfficeRendererOptions) {
    this.scene = options.scene;
    this.atlasTexture = options.atlasTexture;
    this.npcTextures = options.npcTextures;

    const { width, height } = this.scene.scale;
    const availableWidth = Math.max(240, width - 24);
    const availableHeight = Math.max(260, height - Math.max(92, height * 0.13) - 20);
    const fitScale = Math.min(availableWidth / DESIGN_WIDTH, availableHeight / DESIGN_HEIGHT);

    this.scale = Math.max(0.25, Math.floor(fitScale * 4) / 4);
    this.left = Math.round((width - DESIGN_WIDTH * this.scale) / 2);
    this.top = Math.round(Math.max(82, height * 0.13));
  }

  render(): void {
    this.drawRoomShell();
    this.drawBalconies();
    this.drawEntrance();

    STATIONS.forEach((station, index) => {
      this.drawStation(station, index);
    });

    this.drawRoomLabel();
  }

  private drawRoomShell(): void {
    const graphics = this.scene.add.graphics();
    const roomTop = this.y(48);
    const roomBottom = this.y(448);

    graphics.fillStyle(COLORS.outside, 1);
    graphics.fillRect(this.x(0), this.y(0), this.size(DESIGN_WIDTH), this.size(DESIGN_HEIGHT));

    graphics.fillStyle(COLORS.wallEdge, 1);
    graphics.fillRect(this.x(16), roomTop, this.size(672), roomBottom - roomTop);
    graphics.fillStyle(COLORS.wall, 1);
    graphics.fillRect(this.x(24), this.y(56), this.size(656), this.size(384));
    graphics.fillStyle(COLORS.floor, 1);
    graphics.fillRect(this.x(40), this.y(72), this.size(624), this.size(352));

    graphics.lineStyle(Math.max(1, this.size(1)), COLORS.floorLine, 0.55);
    for (let x = 40; x <= 664; x += 16) {
      graphics.lineBetween(this.x(x), this.y(72), this.x(x), this.y(424));
    }
    for (let y = 72; y <= 424; y += 16) {
      graphics.lineBetween(this.x(40), this.y(y), this.x(664), this.y(y));
    }
  }

  private drawBalconies(): void {
    const graphics = this.scene.add.graphics();
    const balconyWidth = 176;
    const balconyXs = [80, 448];

    for (const balconyX of balconyXs) {
      graphics.fillStyle(COLORS.wallEdge, 1);
      graphics.fillRect(this.x(balconyX), this.y(0), this.size(balconyWidth), this.size(64));
      graphics.fillStyle(COLORS.balcony, 1);
      graphics.fillRect(this.x(balconyX + 8), this.y(8), this.size(160), this.size(48));
      graphics.lineStyle(Math.max(1, this.size(2)), COLORS.balconyLine, 1);
      graphics.lineBetween(this.x(balconyX + 8), this.y(16), this.x(balconyX + 168), this.y(16));

      for (let railX = balconyX + 16; railX <= balconyX + 160; railX += 16) {
        graphics.lineBetween(this.x(railX), this.y(8), this.x(railX), this.y(24));
      }

      graphics.fillStyle(COLORS.glass, 1);
      graphics.fillRect(this.x(balconyX + 24), this.y(48), this.size(128), this.size(16));
      graphics.fillStyle(COLORS.glassLight, 0.75);
      graphics.fillRect(this.x(balconyX + 28), this.y(51), this.size(52), this.size(3));

      this.addAtlasCrop(balconyX + 72, 47, ATLAS_CROPS.window, 0, 2);
      this.addAtlasCrop(balconyX + 112, 47, ATLAS_CROPS.window, 0, 2);
      this.addAtlasCrop(balconyX + 16, 8, ATLAS_CROPS.plant, 0, 0.7);
    }
  }

  private drawEntrance(): void {
    const graphics = this.scene.add.graphics();

    graphics.fillStyle(COLORS.outside, 1);
    graphics.fillRect(this.x(328), this.y(408), this.size(48), this.size(56));
    this.addAtlasCrop(352, 440, ATLAS_CROPS.door, 0, 1);

    this.scene.add
      .text(this.x(352), this.y(426), 'ENTRY', {
        color: '#e6c277',
        fontFamily: 'monospace',
        fontSize: `${Math.max(6, Math.round(this.size(7)))}px`,
        letterSpacing: Math.max(1, Math.round(this.size(1))),
      })
      .setOrigin(0.5);
  }

  private drawStation(station: StationLayout, index: number): void {
    const rotation =
      station.side === 'left' ? Math.PI / 2 : station.side === 'right' ? -Math.PI / 2 : 0;
    const workstation = this.addAtlasCrop(
      station.x,
      station.y,
      ATLAS_CROPS.workstation,
      rotation,
      1.35,
    );

    const chairOffset =
      station.side === 'left'
        ? { x: 44, y: 0 }
        : station.side === 'right'
          ? { x: -44, y: 0 }
          : { x: 0, y: -48 };
    const developerOffset =
      station.side === 'left'
        ? { x: 48, y: 0 }
        : station.side === 'right'
          ? { x: -48, y: 0 }
          : { x: 0, y: -50 };

    const chair = this.addAtlasCrop(
      station.x + chairOffset.x,
      station.y + chairOffset.y,
      ATLAS_CROPS.chair,
      rotation,
      1,
    );
    chair.setTint(index % 2 === 0 ? 0xf6d5de : 0xd3e2f2);

    const screen = this.scene.add.rectangle(
      this.x(station.x),
      this.y(station.y - (station.side === 'bottom' ? 9 : 0)),
      this.size(station.side === 'bottom' ? 11 : 7),
      this.size(station.side === 'bottom' ? 6 : 11),
      COLORS.screen,
      0.82,
    );
    screen.setStrokeStyle(Math.max(1, this.size(1)), COLORS.screenEdge, 0.8);
    this.scene.tweens.add({
      targets: screen,
      alpha: 0.34,
      duration: 680 + index * 67,
      yoyo: true,
      repeat: -1,
      delay: index * 83,
    });

    if (this.npcTextures.length > 0) {
      const developer = this.scene.add
        .sprite(
          this.x(station.x + developerOffset.x),
          this.y(station.y + developerOffset.y),
          this.npcTextures[index % this.npcTextures.length]!,
          0,
        )
        .setScale(this.scale * 0.62)
        .setOrigin(0.5, 0.72)
        .setFlipX(index % 3 === 0);

      this.scene.tweens.add({
        targets: developer,
        y: developer.y - this.size(index % 2 === 0 ? 2 : 1),
        duration: 640 + index * 43,
        yoyo: true,
        repeat: -1,
        delay: index * 71,
        ease: 'Stepped',
        easeParams: [2],
      });

      if (index === 1 || index === 4 || index === 8) {
        this.drawActivityBubble(developer.x, developer.y - this.size(24), index);
      }
    }

    workstation.setDepth(2);
    chair.setDepth(1);
  }

  private drawActivityBubble(x: number, y: number, index: number): void {
    const messages = ['</>', 'PR', '✓'];
    const bubble = this.scene.add
      .text(x, y, messages[index % messages.length]!, {
        color: '#243137',
        backgroundColor: '#f7f2df',
        fontFamily: 'monospace',
        fontSize: `${Math.max(7, Math.round(this.size(8)))}px`,
        padding: {
          x: Math.max(2, Math.round(this.size(2))),
          y: Math.max(1, Math.round(this.size(1))),
        },
      })
      .setOrigin(0.5)
      .setDepth(4);

    this.scene.tweens.add({
      targets: bubble,
      alpha: 0.25,
      y: y - this.size(3),
      duration: 1_600 + index * 110,
      yoyo: true,
      repeat: -1,
      delay: index * 190,
      hold: 900,
    });
  }

  private drawRoomLabel(): void {
    this.scene.add
      .text(this.x(352), this.y(86), `DEV TEAM · ${STATIONS.length} ACTIVE STATIONS`, {
        color: COLORS.signText,
        backgroundColor: '#f7f2df',
        fontFamily: 'monospace',
        fontSize: `${Math.max(7, Math.round(this.size(9)))}px`,
        letterSpacing: Math.max(1, Math.round(this.size(1))),
        padding: {
          x: Math.max(3, Math.round(this.size(4))),
          y: Math.max(2, Math.round(this.size(2))),
        },
      })
      .setOrigin(0.5)
      .setDepth(5);
  }

  private addAtlasCrop(
    x: number,
    y: number,
    crop: (typeof ATLAS_CROPS)[keyof typeof ATLAS_CROPS],
    rotation: number,
    assetScale: number,
  ): Phaser.GameObjects.Image {
    const image = this.scene.add
      .image(this.x(x), this.y(y), this.atlasTexture)
      .setCrop(crop.x, crop.y, crop.width, crop.height)
      .setScale(this.scale * assetScale)
      .setRotation(rotation)
      .setOrigin((crop.x + crop.width / 2) / 256, (crop.y + crop.height / 2) / 512);

    return image;
  }

  private x(value: number): number {
    return Math.round(this.left + value * this.scale);
  }

  private y(value: number): number {
    return Math.round(this.top + value * this.scale);
  }

  private size(value: number): number {
    return Math.max(1, Math.round(value * this.scale));
  }
}
