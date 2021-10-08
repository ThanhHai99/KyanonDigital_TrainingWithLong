import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';

// module
import { CoreModule } from '@module/core/core.module';

import { AuthModule } from '@module/auth/auth.module';
import { UserModule } from '@module/user/user.module';
import { RoleModule } from '@module/role/role.module';
import { ItemModule } from '@module/item/item.module';
import { ItemLogModule } from '@module/item_log/item_log.module';
import { SaleModule } from '@module/sale/sale.module';
import { SaleLogModule } from '@module/sale_log/sale_log.module';
import { SaleItemModule } from '@module/sale_item/sale_item.module';
import { InvoiceModule } from '@module/invoice/invoice.module';
import { CategoryModule } from '@module/category/category.module';
import { CategoryLogModule } from '@module/category_log/category_log.module';
import { WarehouseModule } from '@module/warehouse/warehouse.module';
import { WarehouseLogModule } from '@module/warehouse_log/warehouse_log.module';
import { OrderModule } from '@module/order/order.module';
import { ItemOrderModule } from '@module/item_order/item_order.module';
import { PriceLogModule } from '@module/price_log/price_log.module';

@Module({
  imports: [
    // Core
    CoreModule,

    // Service
    RoleModule,
    UserModule,
    AuthModule,
    WarehouseModule,
    SaleModule,
    OrderModule,
    CategoryModule,
    ItemModule,
    InvoiceModule,
    SaleLogModule,
    SaleItemModule,
    WarehouseLogModule,
    CategoryLogModule,
    ItemLogModule,
    ItemOrderModule,
    PriceLogModule
  ]
})
export class AppModule {}
