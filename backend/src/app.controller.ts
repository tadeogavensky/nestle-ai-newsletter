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

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('db-health')
  async testDatabaseHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        ok: true,
        message: 'Database connection is healthy',
      };
    } catch (error) {
      return {
        ok: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
