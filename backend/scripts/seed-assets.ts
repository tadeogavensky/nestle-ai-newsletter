import 'dotenv/config';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { basename, extname, relative, resolve, sep } from 'node:path';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { asset_type } from '@prisma/client';
import { AssetsService } from '../src/assets/assets.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { StorageService } from '../src/storage/storage.service';

type AssetSeedTarget =
  | {
      kind: 'asset';
      type: asset_type;
    }
  | {
      kind: 'font';
    };

type SeedFile = {
  absolutePath: string;
  relativePath: string;
  storageKey: string;
  mimeType: string;
  target: AssetSeedTarget;
};

type ScriptOptions = {
  sourceDirectory: string;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
  ],
  providers: [AssetsService, StorageService],
})
class AssetSeedScriptModule {}

async function main(): Promise<void> {
  const options = parseArguments(process.argv.slice(2));

  if (!options) {
    printUsage();
    return;
  }

  const app = await NestFactory.createApplicationContext(AssetSeedScriptModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const storageService = app.get(StorageService);
    const assetsService = app.get(AssetsService);
    const prisma = app.get(PrismaService);
    const seedFiles = await discoverSeedFiles(options.sourceDirectory);

    let seededAssets = 0;
    let seededFonts = 0;

    for (const seedFile of seedFiles) {
      const buffer = await readFile(seedFile.absolutePath);

      await storageService.uploadObject(
        seedFile.storageKey,
        buffer,
        seedFile.mimeType,
      );

      if (seedFile.target.kind === 'font') {
        await upsertFont(prisma, seedFile);
        seededFonts += 1;
        continue;
      }

      await assetsService.upsertSeededAsset({
        name: basename(seedFile.relativePath),
        type: seedFile.target.type,
        storageKey: seedFile.storageKey,
        description: seedFile.relativePath,
      });
      seededAssets += 1;
    }

    Logger.log(
      `Seed completed. Assets: ${seededAssets}. Fonts: ${seededFonts}.`,
      'SeedAssetsScript',
    );
  } finally {
    await app.close();
  }
}

function parseArguments(args: string[]): ScriptOptions | null {
  if (args.includes('--help') || args.includes('-h')) {
    return null;
  }

  const sourceDirectory =
    readOption(args, '--source') ?? resolve(process.cwd(), 'assets');

  if (!existsSync(sourceDirectory)) {
    throw new Error(`Assets source directory does not exist: ${sourceDirectory}`);
  }

  return { sourceDirectory };
}

function readOption(args: string[], optionName: string): string | undefined {
  const optionIndex = args.indexOf(optionName);

  if (optionIndex === -1) {
    return undefined;
  }

  return args[optionIndex + 1];
}

async function discoverSeedFiles(sourceDirectory: string): Promise<SeedFile[]> {
  const absoluteSourceDirectory = resolve(sourceDirectory);
  const filePaths = await walkFiles(absoluteSourceDirectory);

  return filePaths.map((absolutePath) =>
    buildSeedFile(absoluteSourceDirectory, absolutePath),
  );
}

async function walkFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = resolve(directory, entry.name);

      if (entry.isDirectory()) {
        return walkFiles(absolutePath);
      }

      return [absolutePath];
    }),
  );

  return nestedPaths.flat();
}

function buildSeedFile(sourceDirectory: string, absolutePath: string): SeedFile {
  const relativePath = relative(sourceDirectory, absolutePath).split(sep).join('/');
  const target = inferSeedTarget(relativePath);

  return {
    absolutePath,
    relativePath,
    storageKey: `assets/${relativePath}`,
    mimeType: resolveMimeType(absolutePath),
    target,
  };
}

function inferSeedTarget(relativePath: string): AssetSeedTarget {
  if (relativePath.startsWith('fonts/')) {
    return { kind: 'font' };
  }

  if (relativePath.startsWith('brand_shapes/')) {
    return { kind: 'asset', type: asset_type.SHAPE };
  }

  if (relativePath.startsWith('keywords/')) {
    return { kind: 'asset', type: asset_type.KEYWORD };
  }

  if (relativePath.startsWith('logos/')) {
    return { kind: 'asset', type: asset_type.LOGO };
  }

  if (relativePath.startsWith('we_make_nestle/')) {
    return { kind: 'asset', type: asset_type.LOCKUP };
  }

  throw new Error(`Cannot infer asset type from path: ${relativePath}`);
}

function resolveMimeType(filePath: string): string {
  const extension = extname(filePath).toLowerCase();

  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.ttf':
      return 'font/ttf';
    case '.otf':
      return 'font/otf';
    case '.woff':
      return 'font/woff';
    case '.woff2':
      return 'font/woff2';
    default:
      throw new Error(`Unsupported file extension for asset seed: ${extension}`);
  }
}

async function upsertFont(prisma: PrismaService, seedFile: SeedFile): Promise<void> {
  const existingFont = await prisma.fonts.findFirst({
    where: {
      url: seedFile.storageKey,
    },
    select: {
      id: true,
    },
  });

  const fontData = {
    name: basename(seedFile.relativePath),
    url: seedFile.storageKey,
  };

  if (existingFont) {
    await prisma.fonts.update({
      where: {
        id: existingFont.id,
      },
      data: fontData,
    });
    return;
  }

  await prisma.fonts.create({
    data: fontData,
  });
}

function printUsage(): void {
  Logger.log(
    'Usage: pnpm --dir backend exec ts-node scripts/seed-assets.ts [--source assets]',
    'SeedAssetsScript',
  );
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  Logger.error(message, undefined, 'SeedAssetsScript');
  process.exitCode = 1;
});
