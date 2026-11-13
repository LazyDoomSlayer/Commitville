import { access, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(repositoryRoot, 'public', 'assets', 'private');
const pixelwoodOutputRoot = path.join(outputRoot, 'pixelwood-valley');
const donargOutputRoot = path.join(outputRoot, 'donarg-office');
const defaultPixelwoodRoot = path.join(
  repositoryRoot,
  'private',
  'assets',
  'pixelwood-valley',
  'Pixelwood Valley 1.1.4',
);
const pixelwoodRoot = process.env.PIXELWOOD_ASSET_ROOT
  ? path.resolve(process.env.PIXELWOOD_ASSET_ROOT)
  : defaultPixelwoodRoot;
const defaultDonargRoot = path.join(
  repositoryRoot,
  'private',
  'assets',
  'donarg-office',
  'Office Tileset',
);
const donargRoot = process.env.DONARG_ASSET_ROOT
  ? path.resolve(process.env.DONARG_ASSET_ROOT)
  : defaultDonargRoot;

const pixelwoodSelectedAssets = {
  interiorTiles: ['interior/tiles.PNG', 'interior-tiles.png'],
  deskFront: ['interior/furniture/DESK_FRONT.png', 'desk-front.png'],
  deskBack: ['interior/furniture/DESK_BACK.png', 'desk-back.png'],
  chairFront: ['interior/furniture/chair_FRONT.png', 'chair-front.png'],
  chairBack: ['interior/furniture/chair_BACK.png', 'chair-back.png'],
  bookshelf: ['interior/furniture/BOOKSHELF.png', 'bookshelf.png'],
  bookshelfBack: ['interior/furniture/BOOKSHELF_BACK.png', 'bookshelf-back.png'],
  window: ['interior/furniture/WINDOW.png', 'window.png'],
  meetingTable: ['interior/furniture/table.png', 'meeting-table.png'],
  plantOne: ['interior/flower and tree pots/1.png', 'plant-1.png'],
  plantThree: ['interior/flower and tree pots/3.png', 'plant-3.png'],
  npcOne: ['NPCs/1.png', 'npc-1.png'],
  npcTwo: ['NPCs/2.png', 'npc-2.png'],
  npcThree: ['NPCs/3.png', 'npc-3.png'],
  npcFour: ['NPCs/4.png', 'npc-4.png'],
};

const donargSelectedAssets = {
  tileset: ['Office Tileset All 16x16.png', 'office-tileset-16x16.png'],
  tilesetNoShadow: ['Office Tileset All 16x16 no shadow.png', 'office-tileset-16x16-no-shadow.png'],
  officeDesign: ['Office Designs/Office Level 3.png', 'office-level-3.png'],
};

const clearPreparedAssets = async () => {
  await rm(outputRoot, { force: true, recursive: true });
};

if (process.argv.includes('--clear')) {
  await clearPreparedAssets();
  console.log(`Cleared generated private assets from ${outputRoot}`);
  process.exit(0);
}

const pathExists = async (target) => {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
};

const hasPixelwood = await pathExists(path.join(pixelwoodRoot, 'NPCs', '1.png'));
const hasDonarg = await pathExists(path.join(donargRoot, 'Office Tileset All 16x16.png'));

if (!hasPixelwood && !hasDonarg) {
  console.error(
    [
      'No supported licensed art pack was found.',
      `Pixelwood expected at: ${pixelwoodRoot}`,
      `Donarg Office expected at: ${donargRoot}`,
      'Set PIXELWOOD_ASSET_ROOT or DONARG_ASSET_ROOT to use another local extraction path.',
    ].join('\n'),
  );
  process.exit(1);
}

await clearPreparedAssets();
const packs = {};
let preparedAssetCount = 0;

const preparePackAssets = async (sourceRoot, destinationRoot, publicDirectory, selection) => {
  await mkdir(destinationRoot, { recursive: true });
  const manifestAssets = {};

  for (const [name, [sourcePath, outputName]] of Object.entries(selection)) {
    const source = path.join(sourceRoot, sourcePath);
    const destination = path.join(destinationRoot, outputName);

    await cp(source, destination);
    manifestAssets[name] = `${publicDirectory}/${outputName}`;
    preparedAssetCount += 1;
  }

  return manifestAssets;
};

if (hasPixelwood) {
  const assets = await preparePackAssets(
    pixelwoodRoot,
    pixelwoodOutputRoot,
    'pixelwood-valley',
    pixelwoodSelectedAssets,
  );

  packs.pixelwoodValley = {
    id: 'pixelwood-valley',
    title: 'Pixelwood Valley',
    version: '1.1.4',
    creator: 'Gowl',
    source: 'https://gowldev.itch.io/pixelwood-valley',
    license: 'Premium license; local runtime integration only',
    assets,
    npcFrame: {
      width: 59,
      height: 49,
    },
  };
}

if (hasDonarg) {
  const assets = await preparePackAssets(
    donargRoot,
    donargOutputRoot,
    'donarg-office',
    donargSelectedAssets,
  );

  packs.donargOffice = {
    id: 'donarg-office',
    title: 'Office Interior Tileset',
    version: 'downloaded-2026-11-13',
    creator: 'Donarg',
    source: 'https://donarg.itch.io/office',
    license: 'Bundled license; local runtime integration only',
    assets,
  };
}

const manifest = {
  schemaVersion: 1,
  packs,
};

await writeFile(
  path.join(outputRoot, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log(
  `Prepared ${preparedAssetCount} licensed assets from ${Object.keys(packs).length} pack(s) in ${outputRoot}`,
);
