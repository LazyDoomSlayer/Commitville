import Phaser from 'phaser';

import {
  PRIVATE_ASSETS_REGISTRY_KEY,
  type DonargAssetPaths,
  type DonargOfficePackManifest,
  type PixelwoodAssetPaths,
  type PixelwoodPackManifest,
  type PrivateAssetsManifest,
} from '../../services/assets/private-assets.service';
import { DonargOfficeRenderer } from './donarg-office.renderer';

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
  pixelwoodWall: 0x332b2f,
  pixelwoodFloor: 0x8d552f,
  pixelwoodFloorLight: 0xa9643a,
  pixelwoodScreen: 0x8fd3c1,
} as const;

const PIXELWOOD_TEXTURES: Record<keyof PixelwoodAssetPaths, string> = {
  interiorTiles: 'pixelwood-interior-tiles',
  deskFront: 'pixelwood-desk-front',
  deskBack: 'pixelwood-desk-back',
  chairFront: 'pixelwood-chair-front',
  chairBack: 'pixelwood-chair-back',
  bookshelf: 'pixelwood-bookshelf',
  bookshelfBack: 'pixelwood-bookshelf-back',
  window: 'pixelwood-window',
  meetingTable: 'pixelwood-meeting-table',
  plantOne: 'pixelwood-plant-1',
  plantThree: 'pixelwood-plant-3',
  npcOne: 'pixelwood-npc-1',
  npcTwo: 'pixelwood-npc-2',
  npcThree: 'pixelwood-npc-3',
  npcFour: 'pixelwood-npc-4',
};

const DONARG_TEXTURES: Record<keyof DonargAssetPaths, string> = {
  tileset: 'donarg-office-tileset',
  tilesetNoShadow: 'donarg-office-tileset-no-shadow',
  officeDesign: 'donarg-office-design',
};

const NPC_ASSET_NAMES: ReadonlyArray<keyof PixelwoodAssetPaths> = [
  'npcOne',
  'npcTwo',
  'npcThree',
  'npcFour',
];

export class OfficeScene extends Phaser.Scene {
  private pixelwoodPack: PixelwoodPackManifest | null = null;
  private donargPack: DonargOfficePackManifest | null = null;

  constructor() {
    super('office');
  }

  preload(): void {
    const manifest = this.registry.get(PRIVATE_ASSETS_REGISTRY_KEY) as PrivateAssetsManifest | null;

    this.pixelwoodPack = manifest?.packs.pixelwoodValley ?? null;
    this.donargPack = manifest?.packs.donargOffice ?? null;

    if (!this.pixelwoodPack && !this.donargPack) {
      return;
    }

    const privateAssetBaseUrl = `${import.meta.env.BASE_URL}assets/private/`;

    if (this.pixelwoodPack) {
      for (const [name, relativePath] of Object.entries(this.pixelwoodPack.assets) as Array<
        [keyof PixelwoodAssetPaths, string]
      >) {
        const textureKey = PIXELWOOD_TEXTURES[name];

        if (this.textures.exists(textureKey)) {
          continue;
        }

        const assetUrl = `${privateAssetBaseUrl}${relativePath}`;

        if (NPC_ASSET_NAMES.includes(name)) {
          this.load.spritesheet(textureKey, assetUrl, {
            frameWidth: this.pixelwoodPack.npcFrame.width,
            frameHeight: this.pixelwoodPack.npcFrame.height,
          });
        } else {
          this.load.image(textureKey, assetUrl);
        }
      }
    }

    if (this.donargPack) {
      for (const [name, relativePath] of Object.entries(this.donargPack.assets) as Array<
        [keyof DonargAssetPaths, string]
      >) {
        const textureKey = DONARG_TEXTURES[name];

        if (!this.textures.exists(textureKey)) {
          this.load.image(textureKey, `${privateAssetBaseUrl}${relativePath}`);
        }
      }
    }
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.wall);

    if (this.donargPack && this.textures.exists(DONARG_TEXTURES.tilesetNoShadow)) {
      this.drawDonargOffice();
    } else if (this.pixelwoodPack && this.textures.exists(PIXELWOOD_TEXTURES.deskFront)) {
      this.drawPixelwoodOffice();
    } else {
      this.drawFoundationOffice();
    }

    this.scale.on('resize', () => {
      this.scene.restart();
    });
  }

  private drawDonargOffice(): void {
    const npcTextures = this.pixelwoodPack
      ? NPC_ASSET_NAMES.map((name) => PIXELWOOD_TEXTURES[name]).filter((texture) =>
          this.textures.exists(texture),
        )
      : [];

    new DonargOfficeRenderer({
      scene: this,
      atlasTexture: DONARG_TEXTURES.tilesetNoShadow,
      npcTextures,
    }).render();
  }

  private drawPixelwoodOffice(): void {
    const { width, height } = this.scale;
    const graphics = this.add.graphics();
    const roomX = Math.max(20, width * 0.06);
    const roomY = Math.max(96, height * 0.17);
    const roomWidth = width - roomX * 2;
    const roomHeight = height - roomY - Math.max(28, height * 0.06);
    const assetScale = roomWidth >= 760 ? 3 : 2;
    const centerX = width / 2;

    graphics.fillStyle(COLORS.pixelwoodWall, 1);
    graphics.fillRect(roomX - 10, roomY - 18, roomWidth + 20, roomHeight + 28);
    graphics.fillStyle(COLORS.pixelwoodFloor, 1);
    graphics.fillRect(roomX, roomY, roomWidth, roomHeight);

    const floorTileSize = 16 * assetScale;
    graphics.lineStyle(1, COLORS.pixelwoodFloorLight, 0.32);
    for (let x = roomX; x <= roomX + roomWidth; x += floorTileSize) {
      graphics.lineBetween(x, roomY, x, roomY + roomHeight);
    }
    for (let y = roomY; y <= roomY + roomHeight; y += floorTileSize) {
      graphics.lineBetween(roomX, y, roomX + roomWidth, y);
    }

    const windowY = roomY + 8;
    for (let x = roomX + 52; x < roomX + roomWidth - 40; x += 96) {
      this.add.image(x, windowY, PIXELWOOD_TEXTURES.window).setScale(assetScale).setOrigin(0.5, 0);
    }

    this.add
      .image(roomX + 20, roomY + 16, PIXELWOOD_TEXTURES.bookshelfBack)
      .setScale(assetScale)
      .setOrigin(0, 0);
    this.add
      .image(roomX + roomWidth - 20, roomY + 16, PIXELWOOD_TEXTURES.bookshelfBack)
      .setScale(assetScale)
      .setOrigin(1, 0);

    if (roomWidth >= 620) {
      const deskY = roomY + roomHeight * 0.5;
      this.drawPixelwoodWorkstation(centerX - 190, deskY, 'npcOne', assetScale);
      this.drawPixelwoodWorkstation(centerX + 190, deskY, 'npcTwo', assetScale);

      this.add
        .image(centerX, roomY + roomHeight - 60, PIXELWOOD_TEXTURES.meetingTable)
        .setScale(assetScale)
        .setOrigin(0.5, 1);
      this.add
        .sprite(centerX - 74, roomY + roomHeight - 70, PIXELWOOD_TEXTURES.npcThree, 0)
        .setScale(assetScale * 0.78)
        .setOrigin(0.5, 0.72);
      this.add
        .sprite(centerX + 74, roomY + roomHeight - 70, PIXELWOOD_TEXTURES.npcFour, 0)
        .setScale(assetScale * 0.78)
        .setOrigin(0.5, 0.72);
    } else {
      this.drawPixelwoodWorkstation(centerX, roomY + roomHeight * 0.46, 'npcOne', assetScale);
      this.add
        .image(centerX, roomY + roomHeight - 36, PIXELWOOD_TEXTURES.meetingTable)
        .setScale(assetScale)
        .setOrigin(0.5, 1);
    }

    this.add
      .image(roomX + 34, roomY + roomHeight - 18, PIXELWOOD_TEXTURES.plantOne)
      .setScale(assetScale)
      .setOrigin(0.5, 1);
    this.add
      .image(roomX + roomWidth - 34, roomY + roomHeight - 18, PIXELWOOD_TEXTURES.plantThree)
      .setScale(assetScale)
      .setOrigin(0.5, 1);

    this.add
      .text(centerX, roomY + 48, 'PRIVATE ART PREVIEW', {
        color: '#f4d6a1',
        fontFamily: 'monospace',
        fontSize: roomWidth >= 620 ? '13px' : '9px',
        letterSpacing: 2,
      })
      .setOrigin(0.5);
  }

  private drawPixelwoodWorkstation(
    x: number,
    y: number,
    npcName: (typeof NPC_ASSET_NAMES)[number],
    assetScale: number,
  ): void {
    this.add.image(x, y, PIXELWOOD_TEXTURES.chairBack).setScale(assetScale).setOrigin(0.5, 1);
    this.add
      .sprite(x, y - assetScale * 8, PIXELWOOD_TEXTURES[npcName], 0)
      .setScale(assetScale * 0.78)
      .setOrigin(0.5, 0.72);
    this.add
      .image(x, y + assetScale * 8, PIXELWOOD_TEXTURES.deskFront)
      .setScale(assetScale)
      .setOrigin(0.5, 0);

    const screen = this.add.rectangle(
      x,
      y + assetScale * 12,
      assetScale * 10,
      assetScale * 6,
      COLORS.pixelwoodScreen,
      1,
    );
    screen.setStrokeStyle(Math.max(1, assetScale - 1), 0x221c1d, 1);
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
