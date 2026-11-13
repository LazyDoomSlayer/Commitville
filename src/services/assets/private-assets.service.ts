export interface PixelwoodAssetPaths {
  interiorTiles: string;
  deskFront: string;
  deskBack: string;
  chairFront: string;
  chairBack: string;
  bookshelf: string;
  bookshelfBack: string;
  window: string;
  meetingTable: string;
  plantOne: string;
  plantThree: string;
  npcOne: string;
  npcTwo: string;
  npcThree: string;
  npcFour: string;
}

export interface PixelwoodPackManifest {
  id: 'pixelwood-valley';
  title: string;
  version: string;
  creator: string;
  source: string;
  license: string;
  assets: PixelwoodAssetPaths;
  npcFrame: {
    width: number;
    height: number;
  };
}

export interface PrivateAssetsManifest {
  schemaVersion: 1;
  packs: {
    pixelwoodValley: PixelwoodPackManifest;
  };
}

export const PRIVATE_ASSETS_REGISTRY_KEY = 'private-assets-manifest';

const assetNames: ReadonlyArray<keyof PixelwoodAssetPaths> = [
  'interiorTiles',
  'deskFront',
  'deskBack',
  'chairFront',
  'chairBack',
  'bookshelf',
  'bookshelfBack',
  'window',
  'meetingTable',
  'plantOne',
  'plantThree',
  'npcOne',
  'npcTwo',
  'npcThree',
  'npcFour',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const parsePrivateAssetsManifest = (value: unknown): PrivateAssetsManifest | null => {
  if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.packs)) {
    return null;
  }

  const pack = value.packs.pixelwoodValley;

  if (!isRecord(pack)) {
    return null;
  }

  const assets = pack.assets;
  const npcFrame = pack.npcFrame;

  if (
    pack.id !== 'pixelwood-valley' ||
    typeof pack.title !== 'string' ||
    typeof pack.version !== 'string' ||
    typeof pack.creator !== 'string' ||
    typeof pack.source !== 'string' ||
    typeof pack.license !== 'string' ||
    !isRecord(assets) ||
    !isRecord(npcFrame) ||
    typeof npcFrame.width !== 'number' ||
    typeof npcFrame.height !== 'number'
  ) {
    return null;
  }

  if (assetNames.some((name) => typeof assets[name] !== 'string')) {
    return null;
  }

  return value as unknown as PrivateAssetsManifest;
};

export const loadPrivateAssets = async (
  baseUrl = import.meta.env.BASE_URL,
  fetcher: typeof fetch = fetch,
): Promise<PrivateAssetsManifest | null> => {
  const manifestUrl = `${baseUrl}assets/private/manifest.json`;

  try {
    const response = await fetcher(manifestUrl, { cache: 'no-store' });

    if (!response.ok) {
      return null;
    }

    return parsePrivateAssetsManifest(await response.json());
  } catch {
    return null;
  }
};
