import Phaser from 'phaser';

import {
  PRIVATE_ASSETS_REGISTRY_KEY,
  type PrivateAssetsManifest,
} from '../../services/assets/private-assets.service';
import { OfficeScene } from '../scenes/office.scene';

export const createGameConfig = (
  parent: string,
  privateAssets: PrivateAssetsManifest | null = null,
): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  backgroundColor: '#101820',
  pixelArt: true,
  roundPixels: true,
  scene: [OfficeScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  render: {
    antialias: false,
  },
  callbacks: {
    preBoot: (game) => {
      game.registry.set(PRIVATE_ASSETS_REGISTRY_KEY, privateAssets);
    },
  },
});
