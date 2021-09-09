import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from 'src/modules/order/controller/orders.controller';
import { Order } from 'src/modules/order/entity/orders.entity';
import { OrderService } from 'src/modules/order/service/orders.service';
import { Invoice } from '../invoice/entity/invoices.entity';
import { InvoiceService } from '../invoice/service/invoices.service';
import { Item } from '../item/entity/items.entity';
import { ItemService } from '../item/service/items.service';
import { ItemOrder } from '../item_order/entity/item_order.entity';
import { ItemOrderService } from '../item_order/service/item_order.service';
import { Sale } from '../sale/entity/sales.entity';
import { SaleService } from '../sale/service/sales.service';
import { SaleItem } from '../sale_item/entity/sale_items.entity';
import { SaleItemService } from '../sale_item/service/sale_items.service';
import { User } from '../user/entity/users.entity';
import { UsersService } from '../user/service/users.service';
import { Warehouse } from '../warehouse/entity/warehouses.entity';
import { WarehouseService } from '../warehouse/service/warehouses.service';
import { WarehouseLog } from '../warehouse_log/entity/warehouse_logs.entity';
import { WarehouseLogService } from '../warehouse_log/service/warehouse_logs.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order,
            ItemOrder,
            Warehouse,
            WarehouseLog,
            Invoice,
            User,
            Item,
            Sale,
            SaleItem
        ])
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
        ItemOrderService,
        WarehouseService,
        WarehouseLogService,
        InvoiceService,
        UsersService,
        ItemService,
        SaleService,
        SaleItemService
    ]
})
export class OrdersModule {}
