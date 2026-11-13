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

export interface DonargAssetPaths {
  tileset: string;
  tilesetNoShadow: string;
  officeDesign: string;
}

export interface DonargOfficePackManifest {
  id: 'donarg-office';
  title: string;
  version: string;
  creator: string;
  source: string;
  license: string;
  assets: DonargAssetPaths;
}

export interface PrivateAssetsManifest {
  schemaVersion: 1;
  packs: {
    pixelwoodValley?: PixelwoodPackManifest;
    donargOffice?: DonargOfficePackManifest;
  };
}

export const PRIVATE_ASSETS_REGISTRY_KEY = 'private-assets-manifest';

const pixelwoodAssetNames: ReadonlyArray<keyof PixelwoodAssetPaths> = [
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

const donargAssetNames: ReadonlyArray<keyof DonargAssetPaths> = [
  'tileset',
  'tilesetNoShadow',
  'officeDesign',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const parsePrivateAssetsManifest = (value: unknown): PrivateAssetsManifest | null => {
  if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.packs)) {
    return null;
  }

  const pixelwoodPack = value.packs.pixelwoodValley;
  const donargPack = value.packs.donargOffice;

  if (pixelwoodPack === undefined && donargPack === undefined) {
    return null;
  }

  if (pixelwoodPack !== undefined) {
    if (!isRecord(pixelwoodPack)) {
      return null;
    }

    const assets = pixelwoodPack.assets;
    const npcFrame = pixelwoodPack.npcFrame;

    if (
      pixelwoodPack.id !== 'pixelwood-valley' ||
      typeof pixelwoodPack.title !== 'string' ||
      typeof pixelwoodPack.version !== 'string' ||
      typeof pixelwoodPack.creator !== 'string' ||
      typeof pixelwoodPack.source !== 'string' ||
      typeof pixelwoodPack.license !== 'string' ||
      !isRecord(assets) ||
      !isRecord(npcFrame) ||
      typeof npcFrame.width !== 'number' ||
      typeof npcFrame.height !== 'number' ||
      pixelwoodAssetNames.some((name) => typeof assets[name] !== 'string')
    ) {
      return null;
    }
  }

  if (donargPack !== undefined) {
    if (!isRecord(donargPack)) {
      return null;
    }

    const assets = donargPack.assets;

    if (
      donargPack.id !== 'donarg-office' ||
      typeof donargPack.title !== 'string' ||
      typeof donargPack.version !== 'string' ||
      typeof donargPack.creator !== 'string' ||
      typeof donargPack.source !== 'string' ||
      typeof donargPack.license !== 'string' ||
      !isRecord(assets) ||
      donargAssetNames.some((name) => typeof assets[name] !== 'string')
    ) {
      return null;
    }
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
