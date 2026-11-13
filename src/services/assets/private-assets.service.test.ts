import { describe, expect, it, vi } from 'vitest';

import {
  loadPrivateAssets,
  parsePrivateAssetsManifest,
  type PrivateAssetsManifest,
} from './private-assets.service';

const validManifest: PrivateAssetsManifest = {
  schemaVersion: 1,
  packs: {
    pixelwoodValley: {
      id: 'pixelwood-valley',
      title: 'Pixelwood Valley',
      version: '1.1.4',
      creator: 'Gowl',
      source: 'https://gowldev.itch.io/pixelwood-valley',
      license: 'Premium license; local runtime integration only',
      npcFrame: { width: 59, height: 49 },
      assets: {
        interiorTiles: 'pixelwood-valley/interior-tiles.png',
        deskFront: 'pixelwood-valley/desk-front.png',
        deskBack: 'pixelwood-valley/desk-back.png',
        chairFront: 'pixelwood-valley/chair-front.png',
        chairBack: 'pixelwood-valley/chair-back.png',
        bookshelf: 'pixelwood-valley/bookshelf.png',
        bookshelfBack: 'pixelwood-valley/bookshelf-back.png',
        window: 'pixelwood-valley/window.png',
        meetingTable: 'pixelwood-valley/meeting-table.png',
        plantOne: 'pixelwood-valley/plant-1.png',
        plantThree: 'pixelwood-valley/plant-3.png',
        npcOne: 'pixelwood-valley/npc-1.png',
        npcTwo: 'pixelwood-valley/npc-2.png',
        npcThree: 'pixelwood-valley/npc-3.png',
        npcFour: 'pixelwood-valley/npc-4.png',
      },
    },
  },
};

describe('private assets service', () => {
  it('accepts a complete Pixelwood manifest', () => {
    expect(parsePrivateAssetsManifest(validManifest)).toEqual(validManifest);
  });

  it('rejects incomplete manifests', () => {
    expect(parsePrivateAssetsManifest({ schemaVersion: 1, packs: {} })).toBeNull();
  });

  it('returns null when the private manifest is unavailable', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 404 }));

    await expect(loadPrivateAssets('/', fetcher)).resolves.toBeNull();
  });

  it('loads a valid private manifest', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify(validManifest), { status: 200 }));

    await expect(loadPrivateAssets('/Commitville/', fetcher)).resolves.toEqual(validManifest);
    expect(fetcher).toHaveBeenCalledWith('/Commitville/assets/private/manifest.json', {
      cache: 'no-store',
    });
  });
});
