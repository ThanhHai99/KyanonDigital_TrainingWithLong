import { Module } from '@nestjs/common';
import { Warehouse } from './entity/warehouses.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseController } from 'src/modules/warehouse/controller/warehouses.controller';
import { WarehouseService } from 'src/modules/warehouse/service/warehouses.service';
import { WarehouseLog } from 'src/modules/warehouse_log/entity/warehouse_logs.entity';
import { WarehouseLogService } from 'src/modules/warehouse_log/service/warehouse_logs.service';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse, WarehouseLog])],
    controllers: [WarehouseController],
    providers: [WarehouseService, WarehouseLogService]
})
export class WarehouseModule {}
