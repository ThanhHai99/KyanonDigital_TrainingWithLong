import { Module } from '@nestjs/common';
import { Warehouse } from '../entities/warehouses.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseController } from 'src/controllers/warehouses.controller';
import { WarehouseService } from 'src/services/warehouses.service';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse])],
    controllers: [WarehouseController],
    providers: [WarehouseService]
})
export class WarehouseModule {}
