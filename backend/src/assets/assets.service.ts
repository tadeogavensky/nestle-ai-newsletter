import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { asset_type } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { basename, extname } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import type {
  UploadedAssetFile,
  UploadedAssetDto,
  UploadAssetsResponseDto,
} from './dto/upload-asset.dto';

type PersistedAsset = {
  id: string;
  name: string;
  type: asset_type;
  url: string;
};

type SeededAssetInput = {
  name: string;
  type: asset_type;
  storageKey: string;
  description?: string | null;
};

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);
  private readonly allowedAssetMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ]);
  private readonly maxAssetSizeBytes = 5 * 1024 * 1024;

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async uploadAssets(
    files: UploadedAssetFile[],
    type: asset_type,
  ): Promise<UploadAssetsResponseDto> {
    try {
      const assets = await Promise.all(
        files.map(async (file) => {
          this.validateAssetFile(file);
          const storageKey = this.createUserUploadStorageKey(
            file.originalname,
            type,
          );

          await this.storageService.uploadObject(
            storageKey,
            file.buffer,
            file.mimetype,
          );

          const asset = await this.prisma.assets.create({
            data: {
              name: file.originalname,
              url: storageKey,
              type,
            },
            select: {
              id: true,
              name: true,
              type: true,
              url: true,
            },
          });

          return this.toUploadedAssetDto(asset);
        }),
      );

      return { assets };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error('Asset upload failed.');

      throw new ServiceUnavailableException(
        'No se pudieron cargar los assets en este momento.',
      );
    }
  }

  async listAssets(type?: asset_type): Promise<UploadAssetsResponseDto> {
    try {
      const assets = await this.prisma.assets.findMany({
        where: type ? { type } : undefined,
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          name: true,
          type: true,
          url: true,
        },
      });

      return {
        assets: await Promise.all(
          assets.map((asset) => this.toUploadedAssetDto(asset)),
        ),
      };
    } catch {
      this.logger.error('Asset list failed.');

      throw new ServiceUnavailableException(
        'No se pudieron obtener los assets en este momento.',
      );
    }
  }

  async upsertSeededAsset(
    input: SeededAssetInput,
  ): Promise<UploadedAssetDto> {
    const existingAsset = await this.prisma.assets.findFirst({
      where: {
        url: input.storageKey,
      },
      select: {
        id: true,
        name: true,
        type: true,
        url: true,
      },
    });

    const asset = existingAsset
      ? await this.prisma.assets.update({
          where: {
            id: existingAsset.id,
          },
          data: {
            name: input.name,
            type: input.type,
            description: input.description ?? null,
          },
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
          },
        })
      : await this.prisma.assets.create({
          data: {
            name: input.name,
            type: input.type,
            url: input.storageKey,
            description: input.description ?? null,
          },
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
          },
        });

    return this.toUploadedAssetDto(asset);
  }

  private validateAssetFile(file: UploadedAssetFile): void {
    if (!this.allowedAssetMimeTypes.has(file.mimetype)) {
      throw new BadRequestException(
        'Solo se permiten imagenes JPG, PNG, WebP, GIF o SVG.',
      );
    }

    if (file.size > this.maxAssetSizeBytes) {
      throw new BadRequestException(
        'Cada archivo debe pesar 5 MB o menos.',
      );
    }

    if (!file.buffer?.length) {
      throw new BadRequestException('El archivo cargado esta vacio.');
    }
  }

  private async toUploadedAssetDto(
    asset: PersistedAsset,
  ): Promise<UploadedAssetDto> {
    return {
      ...asset,
      url: await this.storageService.getSignedUrl(asset.url),
    };
  }

  private createUserUploadStorageKey(
    fileName: string,
    type: asset_type,
  ): string {
    const safeExtension = extname(fileName).toLowerCase();
    const normalizedBaseName = this.normalizePathSegment(
      basename(fileName, safeExtension),
    );
    return `assets/uploads/${type.toLowerCase()}/${normalizedBaseName}-${randomUUID()}${safeExtension}`;
  }

  private normalizePathSegment(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'asset';
  }
}
