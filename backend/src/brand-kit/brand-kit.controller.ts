import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
import { RequirePermission } from '../modules/auth/decorators/permissions.decorator';
import { Action } from '../modules/auth/enum/actions';
import { MockAuthGuard } from '../modules/auth/guards/mockup.guard';
import { PermissionsGuard } from '../modules/auth/guards/permissions.guard';

@Controller('brand-kit')
@UseGuards(MockAuthGuard, PermissionsGuard)
export class BrandKitController {
  constructor(private readonly brandKitService: BrandKitService) {}

  @Get()
  getAll(): string {
    return this.brandKitService.getAll();
  }

  @Post()
  @RequirePermission(Action.BRAND_MANAGE, 'brand-kit')
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
