import { Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NewsLettersService } from './newsletters.service';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewsLettersService) {}
 
  @Get()
  getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    // Los Query params vienen como string, los convertimos a números
    return this.newslettersService.getAll(Number(page), Number(limit));
  }

  @Post()
  create() {
    return this.newslettersService.create();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.newslettersService.getById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.newslettersService.update(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.newslettersService.delete(id);
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string) {
    return this.newslettersService.updateStatus(id);
  }

  @Post(':id/logs')
  addLog(@Param('id') id: string) {
    return this.newslettersService.addLog(id);
  }

  @Get(':id/logs')
  getLogs(@Param('id') id: string) {
    return this.newslettersService.getLogs(id);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.newslettersService.getComments(id);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string) {
    return this.newslettersService.addComment(id);
  }

  @Patch(':id/comments/:commentId')
  updateComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    return this.newslettersService.updateComment(id, commentId);
  }

  @Patch(':id/exports/:exportId')
  updateExports(@Param('id') id: string, @Param('exportId') exportId: string) {
    return this.newslettersService.updateExports(id, exportId);
  }

  @Get(':id/exports')
  getExports(@Param('id') id: string) {
    return this.newslettersService.getExports(id);
  }
}
