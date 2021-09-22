import { Module } from '@nestjs/common';
import { Warehouse } from '@module/warehouse/entity/warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLogModule } from '@module/warehouse_log/warehouse_log.module';
import { WarehouseController } from '@module/warehouse/controller/warehouse.controller';
import { WarehouseService } from '@module/warehouse/service/warehouse.service';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse]), WarehouseLogModule],
    controllers: [WarehouseController],
    providers: [WarehouseService],
    exports: [TypeOrmModule.forFeature([Warehouse]), WarehouseService]
})
export class WarehouseModule {}
