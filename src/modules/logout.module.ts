import { Module } from '@nestjs/common';
import { LogoutController } from './../controllers/logout.controller';

@Module({
  controllers: [LogoutController]
})
export class LogoutModule {}
