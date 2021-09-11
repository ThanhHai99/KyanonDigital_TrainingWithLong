import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { checkJwt } from './middlewares/checkJwt';
import { checkRole } from './middlewares/checkRole';

import { AuthModule } from './module/auth/auth.module';

import { UserModule } from './module/user/user.module';
import { User } from './module/user/entity/user.entity';

import { RoleModule } from './module/role/role.module';
import { Role } from './module/role/entity/role.entity';

import { Item } from './module/item/entity/item.entity';
import { ItemModule } from './module/item/item.module';
import { ItemLog } from './module/item_log/entity/item_log.entity';
import { ItemLogModule } from './module/item_log/item_log.module';

import { Sale } from './module/sale/entity/sale.entity';
import { SaleModule } from './module/sale/sale.module';
import { SaleLog } from './module/sale_log/entity/sale_log.entity';
import { SaleLogModule } from './module/sale_log/sale_log.module';
import { SaleItem } from './module/sale_item/entity/sale_items.entity';
import { SaleItemModule } from './module/sale_item/sale_item.module';

import { Invoice } from './module/invoice/entity/invoice.entity';
import { InvoiceModule } from './module/invoice/invoice.module';

import { Category } from './module/category/entity/category.entity';
import { CategoryModule } from './module/category/category.module';
import { CategoryLog } from './module/category_log/entity/category_log.entity';
import { CategoryLogModule } from './module/category_log/category_log.module';

import { Warehouse } from './module/warehouse/entity/warehouse.entity';
import { WarehouseModule } from './module/warehouse/warehouse.module';
import { WarehouseLog } from './module/warehouse_log/entity/warehouse_log.entity';
import { WarehouseLogModule } from './module/warehouse_log/warehouse_log.module';

import { Order } from './module/order/entity/order.entity';
import { OrderModule } from './module/order/order.module';
import { ItemOrder } from './module/item_order/entity/item_order.entity';
import { ItemOrderModule } from './module/item_order/item_order.module';
import { PriceLog } from './module/price_log/entity/price_log.entity';
import { PriceLogModule } from './module/price_log/price_log.module';

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
        RoleModule,
        UserModule,
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
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    constructor(private connection: Connection) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(checkJwt, checkRole([1])).forRoutes('user');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('role');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('categorie');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('category_log');
        consumer.apply(checkJwt, checkRole([1, 2])).forRoutes('warehouse');
        consumer.apply(checkJwt, checkRole([1, 3])).forRoutes('sale');
        consumer.apply(checkJwt, checkRole([1, 2])).forRoutes('order');
        // consumer.apply(checkJwt, checkRole([4])).forRoutes('orders/');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('item');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('item_log');
        consumer.apply(checkJwt, checkRole([1, 3])).forRoutes('price_log');
    }
}
