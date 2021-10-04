import { Module } from '@nestjs/common';
import { Warehouse } from './warehouse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLogModule } from '@module/warehouse_log/warehouse_log.module';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { ItemModule } from '@module/item/item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse]),
    WarehouseLogModule,
    ItemModule
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [TypeOrmModule, WarehouseService]
})
export class WarehouseModule {}
