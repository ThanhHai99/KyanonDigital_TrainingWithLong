import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity
import { Role } from '@module/role/entity/role.entity';
import { User } from '@module/user/entity/user.entity';
import { Category } from '@module/category/entity/category.entity';
import { Item } from '@module/item/entity/item.entity';
import { Sale } from '@module/sale/entity/sale.entity';
import { SaleItem } from '@module/sale_item/entity/sale_items.entity';
import { Order } from '@module/order/entity/order.entity';
import { ItemOrder } from '@module/item_order/entity/item_order.entity';
import { Invoice } from '@module/invoice/entity/invoice.entity';
import { Warehouse } from '@module/warehouse/entity/warehouse.entity';

import { SaleLog } from '@module/sale_log/entity/sale_log.entity';
import { ItemLog } from '@module/item_log/entity/item_log.entity';
import { WarehouseLog } from '@module/warehouse_log/entity/warehouse_log.entity';
import { CategoryLog } from '@module/category_log/entity/category_log.entity';
import { PriceLog } from '@module/price_log/entity/price_log.entity';

const NODE_ENV = process.env.NODE_ENV;

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `./env/${NODE_ENV ? '.' + NODE_ENV.trim() : ''}.env`,
            isGlobal: true,
            load: [configuration]
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('database.host').toString(),
                port: configService.get<number>('database.port'),
                username: configService
                    .get<string>('database.username')
                    .toString(),
                password: configService
                    .get<string>('database.password')
                    .toString(),
                database: configService
                    .get<string>('database.db_name')
                    .toString(),
                entities: [
                    // "../*/entity/*.entity.ts",
                    User,
                    Role,
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
                // configService.get<string>('database.username')
                //WARNING: Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
                synchronize: false
            })
        })
    ],
    exports: [TypeOrmModule, ConfigModule]
})
export class CoreModule {}
