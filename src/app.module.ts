import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users.module';
import { User } from './entities/users.entity';
import { RegisterModule } from './modules/register.module';
import { LoginModule } from './modules/login.module';
import { checkJwt } from './middlewares/checkJwt';
import { LogoutModule } from './modules/logout.module';
import { RolesModule } from './modules/roles.module';
import { Role } from './entities/roles.entity';
import { Item } from './entities/items.entity';
import { Price } from './entities/prices.entity';
import { Sale } from './entities/sales.entity';
import { Order } from './entities/orders.entity';
import { ItemOrder } from './entities/item_order.entiy';
import { Invoice } from './entities/invoices.entity';
import { Importing } from './entities/importings.entity';
import { Exporting } from './entities/exportings.entity';
import { Category } from './entities/categories.entity';
import { checkRole } from './middlewares/checkRole';
import { Warehouse } from './entities/warehouses.entity';
import { WarehouseModule } from './modules/warehouses.module';
import { SaleModule } from './modules/sales.module';
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
            entities: [ Role, User, Category, Item, Price, Sale, Order, ItemOrder, Invoice, Warehouse, Importing, Exporting ],
            synchronize: true
        }),
        RolesModule,
        UsersModule,
        WarehouseModule,
        SaleModule,
        RegisterModule,
        LoginModule,
        LogoutModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    constructor(private connection: Connection) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(checkJwt, checkRole([1])).forRoutes('users');
        consumer.apply(checkJwt, checkRole([1])).forRoutes('roles');
        consumer.apply(checkJwt, checkRole([1, 2])).forRoutes('warehouses');
        consumer.apply(checkJwt, checkRole([1, 3])).forRoutes('sales');
    }
}
