import { Module } from '@nestjs/common';
import { Warehouse } from '../entities/warehouses.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouse])],
    controllers: [],
    providers: []
})
export class WarehouseModule {}
