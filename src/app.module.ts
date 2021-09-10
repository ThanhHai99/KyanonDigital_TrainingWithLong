import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/user/user.module';
import { User } from './modules/user/entity/user.entity';
import { RolesModule } from './modules/role/role.module';
import { Role } from './modules/role/entity/role.entity';
import { Item } from './modules/item/entity/item.entity';
import { Sale } from './modules/sale/entity/sale.entity';
import { ItemOrder } from './modules/item_order/entity/item_order.entity';
import { Invoice } from './modules/invoice/entity/invoice.entity';
import { Category } from './modules/category/entity/category.entity';
import { Warehouse } from './modules/warehouse/entity/warehouse.entity';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { SaleModule } from './modules/sale/sale.module';
import { checkJwt } from './middlewares/checkJwt';
import { checkRole } from './middlewares/checkRole';
import { CategoryLog } from './modules/category_log/entity/category_log.entity';
import { ItemLog } from './modules/item_log/entity/item_log.entity';
import { SaleItem } from './modules/sale_item/entity/sale_items.entity';
import { Order } from './modules/order/entity/order.entity';
import { PriceLog } from './modules/price_log/entity/price_log.entity';
import { SaleLog } from './modules/sale_log/entity/sale_log.entity';
import { CategoriesModule } from './modules/category/category.module';
import { ItemsModule } from './modules/item/item.module';
import { WarehouseLog } from './modules/warehouse_log/entity/warehouse_log.entity';
import { OrdersModule } from './modules/order/order.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { AuthModule } from './modules/auth/auth.module';
import { SaleLogModule } from './modules/sale_log/sale_log.module';
import { SaleItemModule } from './modules/sale_item/sale_item.module';
import { WarehouseLogModule } from './modules/warehouse_log/warehouse_log.module';
import { CategoryLogModule } from './modules/category_log/category_log.module';
import { ItemLogModule } from './modules/item_log/item_log.module';
import { ItemOrderModule } from './modules/item_order/item_order.module';
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
