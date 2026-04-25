import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BrandKitService } from './brand-kit.service';

@Controller('brand-kit')
export class BrandKitController {
  constructor(private readonly brandKitService: BrandKitService) {}

  @Get()
  getAll(): string {
    return this.brandKitService.getAll();
  }

  @Post()
  create(): string {
    return this.brandKitService.create();
  }

  @Patch(':id')
  update(@Param('id') id: string): string {
    return this.brandKitService.update(id);
  }
}
