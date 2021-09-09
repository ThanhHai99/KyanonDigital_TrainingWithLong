import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/user/users.module';
import { User } from './modules/user/entity/users.entity';
import { RolesModule } from './modules/role/roles.module';
import { Role } from './modules/role/entity/roles.entity';
import { Item } from './modules/item/entity/items.entity';
import { Sale } from './modules/sale/entity/sales.entity';
import { ItemOrder } from './modules/item_order/entity/item_order.entity';
import { Invoice } from './modules/invoice/entity/invoices.entity';
import { Category } from './modules/category/entity/categories.entity';
import { Warehouse } from './modules/warehouse/entity/warehouses.entity';
import { WarehouseModule } from './modules/warehouse/warehouses.module';
import { SaleModule } from './modules/sale/sales.module';
import { checkJwt } from './middlewares/checkJwt';
import { checkRole } from './middlewares/checkRole';
import { CategoryLog } from './modules/category_log/entity/category_logs.entity';
import { ItemLog } from './modules/item_log/entity/item_logs.entity';
import { SaleItem } from './modules/sale_item/entity/sale_items.entity';
import { Order } from './modules/order/entity/orders.entity';
import { PriceLog } from './modules/price_log/entity/price_logs.entity';
import { SaleLog } from './modules/sale_log/entity/sale_logs.entity';
import { CategoriesModule } from './modules/category/categories.module';
import { ItemsModule } from './modules/item/items.module';
import { WarehouseLog } from './modules/warehouse_log/entity/warehouse_logs.entity';
import { OrdersModule } from './modules/order/orders.module';
import { InvoiceModule } from './modules/invoice/invoices.module';
import { AuthModule } from './modules/auth/auth.module';
require('dotenv').config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [
                Role,
                User,
                CategoryLog,
                Category,
                ItemLog,
                Item,
                SaleLog,
                Sale,
                SaleItem,
                Order,
                ItemOrder,
                Invoice,
                WarehouseLog,
                Warehouse,
                PriceLog,
            ],
            synchronize: true
        }),
        AuthModule,
        RolesModule,
        UsersModule,
        WarehouseModule,
        SaleModule,
        OrdersModule,
        CategoriesModule,
        ItemsModule,
        InvoiceModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    constructor(private connection: Connection) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(checkJwt, checkRole([1])).forRoutes('users');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('roles');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('categories');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('category_logs');
        consumer.apply(checkJwt, checkRole([1, 2])).forRoutes('warehouses');
        consumer.apply(checkJwt, checkRole([1, 3])).forRoutes('sales');
        consumer.apply(checkJwt, checkRole([1, 2])).forRoutes('orders');
        // consumer.apply(checkJwt, checkRole([4])).forRoutes('orders/');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('items');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('item_logs');
        consumer.apply(checkJwt, checkRole([1, 3])).forRoutes('price_logs');
    }
}
