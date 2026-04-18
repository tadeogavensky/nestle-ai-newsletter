import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('prisma-test')
  async testPrismaConnection() {
    try {
      const areas = await this.prisma.areas.findMany();

      return {
        ok: true,
        count: areas.length,
        areas,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown Prisma error',
      };
    }
  }
}
