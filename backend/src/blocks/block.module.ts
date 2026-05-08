import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';

@Module({
  imports: [PrismaModule], // expone PrismaService para inyección
  providers: [BlockService],
  controllers: [BlockController],
  exports: [BlockService],
})
export class BlockModule {}
