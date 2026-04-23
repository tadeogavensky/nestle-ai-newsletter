import { Controller, Get } from '@nestjs/common';
import { BrandKitService } from './brand-kit.service';

@Controller('brand-kit')
export class BrandKitController {
  constructor(private readonly brandKitService: BrandKitService) {}

  @Get()
  getAll(): string {
    return this.brandKitService.getAll();
  }
}
