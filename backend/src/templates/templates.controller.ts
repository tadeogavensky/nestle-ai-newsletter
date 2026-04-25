import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  getAll(): string {
    return this.templatesService.getAll();
  }

  @Post()
  create() {
    return this.templatesService.create();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.templatesService.getById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.templatesService.update(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.templatesService.delete(id);
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string) {
    return this.templatesService.updateStatus(id);
  }

  @Post(':id/blocks')
  defineBlocks(@Param('id') id: string) {
    return this.templatesService.defineBlocks(id);
  }

  @Get(':id/assets')
  getAssets(@Param('id') id: string) {
    return this.templatesService.getAssets(id);
  }

  @Post(':id/assets')
  addAsset(@Param('id') id: string) {
    return this.templatesService.addAsset(id);
  }

  @Patch(':id/assets/:assetId')
  updateAsset(@Param('id') id: string, @Param('assetId') assetId: string) {
    return this.templatesService.updateAsset(id, assetId);
  }
}
