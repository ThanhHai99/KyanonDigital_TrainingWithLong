import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLogController } from './warehouse_log.controller';
import { WarehouseLog } from './warehouse_log.entity';
import { WarehouseLogService } from './warehouse_log.service';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseLog])],
  providers: [WarehouseLogService],
  controllers: [WarehouseLogController],
  exports: [TypeOrmModule, WarehouseLogService]
})
export class WarehouseLogModule {}
