import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(repositoryRoot, 'public', 'assets', 'private');
const pixelwoodOutputRoot = path.join(outputRoot, 'pixelwood-valley');
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

const selectedAssets = {
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

const clearPreparedAssets = async () => {
  await rm(outputRoot, { force: true, recursive: true });
};

if (process.argv.includes('--clear')) {
  await clearPreparedAssets();
  console.log(`Cleared generated private assets from ${outputRoot}`);
  process.exit(0);
}

const packageMarker = path.join(pixelwoodRoot, 'NPCs', '1.png');

try {
  await readFile(packageMarker);
} catch {
  console.error(
    [
      'Pixelwood Valley 1.1.4 was not found.',
      `Expected the licensed pack at: ${pixelwoodRoot}`,
      'Set PIXELWOOD_ASSET_ROOT to use another local extraction path.',
    ].join('\n'),
  );
  process.exit(1);
}

await clearPreparedAssets();
await mkdir(pixelwoodOutputRoot, { recursive: true });

const manifestAssets = {};

for (const [name, [sourcePath, outputName]] of Object.entries(selectedAssets)) {
  const source = path.join(pixelwoodRoot, sourcePath);
  const destination = path.join(pixelwoodOutputRoot, outputName);

  await cp(source, destination);
  manifestAssets[name] = `pixelwood-valley/${outputName}`;
}

const manifest = {
  schemaVersion: 1,
  packs: {
    pixelwoodValley: {
      id: 'pixelwood-valley',
      title: 'Pixelwood Valley',
      version: '1.1.4',
      creator: 'Gowl',
      source: 'https://gowldev.itch.io/pixelwood-valley',
      license: 'Premium license; local runtime integration only',
      assets: manifestAssets,
      npcFrame: {
        width: 59,
        height: 49,
      },
    },
  },
};

await writeFile(
  path.join(outputRoot, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log(
  `Prepared ${Object.keys(selectedAssets).length} licensed Pixelwood assets in ${pixelwoodOutputRoot}`,
);
