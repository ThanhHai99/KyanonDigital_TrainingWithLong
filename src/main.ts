import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let port = process.env.APP_PORT || 3000;
  await app.listen(port);
}
bootstrap();
