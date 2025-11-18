import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Get configuration
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3002);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const corsOrigins = configService.get<string>('CORS_ORIGINS', '*');

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS configuration - Very permissive for tracking
  app.enableCors({
    origin: corsOrigins === '*' ? true : corsOrigins.split(','),
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    exposedHeaders: ['X-Request-Id'],
    maxAge: 86400, // 24 hours
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port);

  logger.log(`🚀 Tracking Service is running on: http://localhost:${port}/api`);
  logger.log(`📊 Environment: ${nodeEnv}`);
  logger.log(`🌍 CORS Origins: ${corsOrigins}`);
  logger.log(`📡 Ready to receive tracking events...`);
}

bootstrap();
