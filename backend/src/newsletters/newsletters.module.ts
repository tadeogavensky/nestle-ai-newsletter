import { Module } from '@nestjs/common';
import { NewsLettersService } from './newsletters.service';
import { NewslettersController } from './newsletters.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  controllers: [NewslettersController],
  imports: [PrismaModule],
  providers: [NewsLettersService],
})
export class NewsLettersModule {}
