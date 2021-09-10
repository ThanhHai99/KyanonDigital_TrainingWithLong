import { Module } from '@nestjs/common';
import { Warehouse } from './entity/warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLogModule } from '../warehouse_log/warehouse_log.module';
import { WarehouseController } from './controller/warehouse.controller';
import { WarehouseService } from './service/warehouse.service';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse]), WarehouseLogModule],
    controllers: [WarehouseController],
    providers: [WarehouseService],
    exports: [TypeOrmModule.forFeature([Warehouse]), WarehouseService]
})
export class WarehouseModule {}
