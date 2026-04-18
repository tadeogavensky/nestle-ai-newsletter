import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    FilesModule,
    ConfigModule.forRoot({
      isGlobal: true, // no tener que importarlo en cada módulo
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
