import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLog } from '@module/warehouse_log/entity/warehouse_log.entity';
import { WarehouseLogService } from '@module/warehouse_log/service/warehouse_log.service';

@Module({
    imports: [TypeOrmModule.forFeature([WarehouseLog])],
    providers: [WarehouseLogService],
    exports: [TypeOrmModule.forFeature([WarehouseLog]), WarehouseLogService]
})
export class WarehouseLogModule {}
