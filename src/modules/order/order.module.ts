import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './controller/order.controller';
import { Order } from './entity/order.entity';
import { OrderService } from './service/order.service';
import { InvoiceModule } from '../invoice/invoice.module';
import { ItemsModule } from '../item/item.module';
import { ItemOrderModule } from '../item_order/item_order.module';
import { SaleModule } from '../sale/sale.module';
import { SaleItemModule } from '../sale_item/sale_item.module';
import { UsersModule } from '../user/user.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { WarehouseLogModule } from '../warehouse_log/warehouse_log.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        ItemOrderModule,
        WarehouseModule,
        WarehouseLogModule,
        InvoiceModule,
        UsersModule,
        ItemsModule,
        SaleModule,
        SaleItemModule
    ],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrdersModule {}
