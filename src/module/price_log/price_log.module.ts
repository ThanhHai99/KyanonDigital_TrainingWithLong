import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceLogController } from './price_log.controller';
import { PriceLog } from './price_log.entity';
import { PriceLogService } from './price_log.service';

@Module({
  imports: [TypeOrmModule.forFeature([PriceLog])],
  controllers: [PriceLogController],
  providers: [PriceLogService],
  exports: [PriceLogService, TypeOrmModule]
})
export class PriceLogModule {}
