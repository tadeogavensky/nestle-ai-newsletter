import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { AreasModule } from './areas/areas.module';

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    AreasModule,
    ConfigModule.forRoot({
      isGlobal: true, // no tener que importarlo en cada módulo
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
