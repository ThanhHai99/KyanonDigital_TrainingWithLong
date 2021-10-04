import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { InvoiceModule } from '@module/invoice/invoice.module';
import { ItemModule } from '@module/item/item.module';
import { ItemOrderModule } from '@module/item_order/item_order.module';
import { SaleModule } from '@module/sale/sale.module';
import { UserModule } from '@module/user/user.module';
import { WarehouseModule } from '@module/warehouse/warehouse.module';
import { WarehouseLogModule } from '@module/warehouse_log/warehouse_log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ItemOrderModule,
    WarehouseModule,
    WarehouseLogModule,
    InvoiceModule,
    UserModule,
    ItemModule,
    SaleModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
