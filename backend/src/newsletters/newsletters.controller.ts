import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NewsLettersService } from './newsletters.service';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewsLettersService) {}

  @Get()
  getAll(): string {
    return this.newslettersService.getAll();
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
}
