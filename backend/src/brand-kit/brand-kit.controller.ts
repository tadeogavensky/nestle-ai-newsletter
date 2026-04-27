import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BrandKitService } from './brand-kit.service';
import { idParamSchema } from '../common/zod/route-params.schema';
import type { IdParam } from '../common/zod/route-params.schema';
import { ZodValidationPipe } from '../common/zod/zod-validation.pipe';
import {
  createBrandKitBodySchema,
  updateBrandKitBodySchema,
} from './brand-kit.schemas';
import type {
  CreateBrandKitBody,
  UpdateBrandKitBody,
} from './brand-kit.schemas';

@Controller('brand-kit')
export class BrandKitController {
  constructor(private readonly brandKitService: BrandKitService) {}

  @Get()
  getAll(): string {
    return this.brandKitService.getAll();
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createBrandKitBodySchema))
    body: CreateBrandKitBody,
  ): string {
    void body;
    return this.brandKitService.create();
  }

  @Patch(':id')
  update(
    @Param(new ZodValidationPipe(idParamSchema)) params: IdParam,
    @Body(new ZodValidationPipe(updateBrandKitBodySchema))
    body: UpdateBrandKitBody,
  ): string {
    void body;
    return this.brandKitService.update(params.id);
  }
}
