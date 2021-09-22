import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '@module/order/controller/order.controller';
import { Order } from '@module/order/entity/order.entity';
import { OrderService } from '@module/order/service/order.service';
import { InvoiceModule } from '@module/invoice/invoice.module';
import { ItemModule } from '@module/item/item.module';
import { ItemOrderModule } from '@module/item_order/item_order.module';
import { SaleModule } from '@module/sale/sale.module';
import { SaleItemModule } from '@module/sale_item/sale_item.module';
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
        SaleModule,
        SaleItemModule
    ],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule {}
