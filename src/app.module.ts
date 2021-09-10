import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/user/user.module';
import { User } from './module/user/entity/user.entity';
import { RolesModule } from './module/role/role.module';
import { Role } from './module/role/entity/role.entity';
import { Item } from './module/item/entity/item.entity';
import { Sale } from './module/sale/entity/sale.entity';
import { ItemOrder } from './module/item_order/entity/item_order.entity';
import { Invoice } from './module/invoice/entity/invoice.entity';
import { Category } from './module/category/entity/category.entity';
import { Warehouse } from './module/warehouse/entity/warehouse.entity';
import { WarehouseModule } from './module/warehouse/warehouse.module';
import { SaleModule } from './module/sale/sale.module';
import { checkJwt } from './middlewares/checkJwt';
import { checkRole } from './middlewares/checkRole';
import { CategoryLog } from './module/category_log/entity/category_log.entity';
import { ItemLog } from './module/item_log/entity/item_log.entity';
import { SaleItem } from './module/sale_item/entity/sale_items.entity';
import { Order } from './module/order/entity/order.entity';
import { PriceLog } from './module/price_log/entity/price_log.entity';
import { SaleLog } from './module/sale_log/entity/sale_log.entity';
import { CategoriesModule } from './module/category/category.module';
import { ItemsModule } from './module/item/item.module';
import { WarehouseLog } from './module/warehouse_log/entity/warehouse_log.entity';
import { OrdersModule } from './module/order/order.module';
import { InvoiceModule } from './module/invoice/invoice.module';
import { AuthModule } from './module/auth/auth.module';
import { SaleLogModule } from './module/sale_log/sale_log.module';
import { SaleItemModule } from './module/sale_item/sale_item.module';
import { WarehouseLogModule } from './module/warehouse_log/warehouse_log.module';
import { CategoryLogModule } from './module/category_log/category_log.module';
import { ItemLogModule } from './module/item_log/item_log.module';
import { ItemOrderModule } from './module/item_order/item_order.module';
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
                PriceLog
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
        SaleLogModule,
        SaleItemModule,
        WarehouseLogModule,
        CategoryLogModule,
        ItemLogModule,
        ItemOrderModule
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
