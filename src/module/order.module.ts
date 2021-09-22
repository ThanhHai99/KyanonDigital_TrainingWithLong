import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '@controller/order.controller';
import { Order } from '@entity/order.entity';
import { OrderService } from '@service/order.service';
import { InvoiceModule } from '@module/invoice.module';
import { ItemModule } from '@module/item.module';
import { ItemOrderModule } from '@module/item_order.module';
import { SaleModule } from '@module/sale.module';
import { SaleItemModule } from '@module/sale_item.module';
import { UserModule } from '@module/user.module';
import { WarehouseModule } from '@module/warehouse.module';
import { WarehouseLogModule } from '@module/warehouse_log.module';

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
