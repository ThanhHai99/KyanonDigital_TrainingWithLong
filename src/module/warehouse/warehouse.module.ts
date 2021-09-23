import { Module } from '@nestjs/common';
import { Warehouse } from './warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLogModule } from '@module/warehouse_log/warehouse_log.module';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse]), WarehouseLogModule],
    controllers: [WarehouseController],
    providers: [WarehouseService],
    exports: [TypeOrmModule.forFeature([Warehouse]), WarehouseService]
})
export class WarehouseModule {}
