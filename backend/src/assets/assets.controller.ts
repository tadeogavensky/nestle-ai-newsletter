import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { asset_type } from '@prisma/client';
import { Resource } from '../modules/auth/enum/resources';
import { AssetsService } from './assets.service';
import type {
  UploadedAssetFile,
  UploadAssetsResponseDto,
} from './dto/upload-asset.dto';

@Controller(Resource.ASSETS)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  listAssets(
    @Headers('authorization') authorization: string | undefined,
    @Query('type') type?: string,
  ): Promise<UploadAssetsResponseDto> {
    this.assertAuthenticated(authorization);

    if (type && !this.isAssetType(type)) {
      throw new BadRequestException('Debe indicar un tipo de asset valido.');
    }

    return this.assetsService.listAssets(type as asset_type | undefined);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  uploadAssets(
    @Headers('authorization') authorization: string | undefined,
    @Body('type') type: string | undefined,
    @UploadedFiles() files: UploadedAssetFile[] | undefined,
  ): Promise<UploadAssetsResponseDto> {
    this.assertAuthenticated(authorization);

    if (!files?.length) {
      throw new BadRequestException('Debe cargar al menos un archivo.');
    }

    if (!this.isAssetType(type)) {
      throw new BadRequestException('Debe indicar un tipo de asset valido.');
    }

    return this.assetsService.uploadAssets(files, type);
  }

  private assertAuthenticated(authorization: string | undefined): void {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication is required');
    }
  }

  private isAssetType(value: string | undefined): value is asset_type {
    return !!value && Object.values(asset_type).includes(value as asset_type);
  }
}
