import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';

// middleware
// import { checkJwt } from '@middleware/checkJwt';
// import { checkRole } from '@middleware/checkRole';

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
export class AppModule implements NestModule {
    constructor(private connection: Connection) {}

    configure(consumer: MiddlewareConsumer) {
        // consumer.apply(checkJwt, checkRole([1])).forRoutes('role');
        // consumer.apply(checkJwt, checkRole([1])).forRoutes('user');
        // consumer.apply(checkJwt, checkRole([1])).forRoutes('category');
        // consumer.apply(checkJwt, checkRole([1])).forRoutes('category_log');
        // consumer.apply(checkJwt, checkRole([1, 2])).forRoutes('warehouse');
        // consumer.apply(checkJwt, checkRole([1, 3])).forRoutes('sale');
        // consumer.apply(checkJwt, checkRole([1, 3])).forRoutes('sale_log');
        // consumer.apply(checkJwt).forRoutes('order');
        // consumer.apply(checkJwt).forRoutes('invoice');
        // consumer.apply(checkJwt, checkRole([1])).forRoutes('item');
        // consumer.apply(checkJwt, checkRole([1])).forRoutes('item_log');
        // consumer.apply(checkJwt, checkRole([1, 3])).forRoutes('price_log');
    }
}
