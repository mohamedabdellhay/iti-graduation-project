import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 1000, // 1000 requests per minute
      },
    ]),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to your 'public' folder
      serveRoot: '/static', // Optional: This is the URL prefix for accessing the static files
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
