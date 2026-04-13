import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { AppModule } from '../src/app/app.module';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';

const server = express();
let app: Awaited<ReturnType<typeof NestFactory.create>> | null = null;

async function bootstrap() {
  if (!app) {
    console.log('[API] Bootstrapping NestJS...');
    console.log('[API] SUPABASE_URL set:', !!process.env.SUPABASE_URL);
    console.log('[API] SUPABASE_SERVICE_ROLE_KEY set:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    try {
      app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
        logger: ['error', 'warn', 'log'],
      });
      app.setGlobalPrefix('api');
      app.enableCors();
      app.useGlobalInterceptors(new LoggingInterceptor());
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        }),
      );
      await app.init();
      console.log('[API] Bootstrap complete');
    } catch (err) {
      console.error('[API] Bootstrap failed:', err);
      throw err;
    }
  }
  return server;
}

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  const expressApp = await bootstrap();
  expressApp(req, res);
}
