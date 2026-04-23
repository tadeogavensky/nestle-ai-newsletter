import { Module } from '@nestjs/common';
import { NewsLettersService } from './newsletters.service';
import { NewslettersController } from './newsletters.controller';

@Module({
  controllers: [NewslettersController],
  providers: [NewsLettersService],
})
export class NewsLettersModule {}
