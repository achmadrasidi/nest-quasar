import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const logger = new Logger();
  const port = process.env.PORT || 5001;
  const app = await NestFactory.create(AppModule);
  const originList = ['http://localhost:8080', '::1'];

  const corsOption = {
    origin: (origin: any, callback: any) => {
      if (originList.includes(origin) || !origin) return callback(null, true);
      return callback(new Error('Forbidden Origin'));
    },
    optionsSuccessStatus: 200,
    methods: ['OPTIONS', 'GET', 'POST', 'PATCH', 'DELETE'],
  };
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ extended: true, limit: '100mb' }));
  app.use(cors(corsOption));

  await app.listen(port);

  logger.log(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
