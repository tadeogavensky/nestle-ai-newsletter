import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import {
  idAndAssetIdParamSchema,
  idParamSchema,
} from '../common/zod/route-params.schema';
import type {
  IdAndAssetIdParam,
  IdParam,
} from '../common/zod/route-params.schema';
import { ZodValidationPipe } from '../common/zod/zod-validation.pipe';
import {
  addTemplateAssetBodySchema,
  createTemplateBodySchema,
  defineTemplateBlocksBodySchema,
  updateTemplateAssetBodySchema,
  updateTemplateBodySchema,
  updateTemplateStatusBodySchema,
} from './templates.schemas';
import type {
  AddTemplateAssetBody,
  CreateTemplateBody,
  DefineTemplateBlocksBody,
  UpdateTemplateAssetBody,
  UpdateTemplateBody,
  UpdateTemplateStatusBody,
} from './templates.schemas';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  getAll(): string {
    return this.templatesService.getAll();
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createTemplateBodySchema))
    body: CreateTemplateBody,
  ) {
    void body;
    return this.templatesService.create();
  }

  @Get(':id')
  getById(@Param(new ZodValidationPipe(idParamSchema)) params: IdParam) {
    return this.templatesService.getById(params.id);
  }

  @Patch(':id')
  update(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParam,
    @Body(new ZodValidationPipe(updateTemplateBodySchema))
    body: UpdateTemplateBody,
  ) {
    void body;
    return this.templatesService.update(params.id);
  }

  @Delete(':id')
  delete(@Param(new ZodValidationPipe(idParamSchema)) params: IdParam) {
    return this.templatesService.delete(params.id);
  }

  @Post(':id/status')
  updateStatus(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParam,
    @Body(new ZodValidationPipe(updateTemplateStatusBodySchema))
    body: UpdateTemplateStatusBody,
  ) {
    void body;
    return this.templatesService.updateStatus(params.id);
  }

  @Post(':id/blocks')
  defineBlocks(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParam,
    @Body(new ZodValidationPipe(defineTemplateBlocksBodySchema))
    body: DefineTemplateBlocksBody,
  ) {
    void body;
    return this.templatesService.defineBlocks(params.id);
  }

  @Get(':id/assets')
  getAssets(@Param(new ZodValidationPipe(idParamSchema)) params: IdParam) {
    return this.templatesService.getAssets(params.id);
  }

  @Post(':id/assets')
  addAsset(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParam,
    @Body(new ZodValidationPipe(addTemplateAssetBodySchema))
    body: AddTemplateAssetBody,
  ) {
    void body;
    return this.templatesService.addAsset(params.id);
  }

  @Patch(':id/assets/:assetId')
  updateAsset(
    @Param(new ZodValidationPipe(idAndAssetIdParamSchema))
    params: IdAndAssetIdParam,
    @Body(new ZodValidationPipe(updateTemplateAssetBodySchema))
    body: UpdateTemplateAssetBody,
  ) {
    void body;
    return this.templatesService.updateAsset(params.id, params.assetId);
  }
}
