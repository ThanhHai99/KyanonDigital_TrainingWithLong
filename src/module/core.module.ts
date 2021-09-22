import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity
import { Role } from '@entity/role.entity';
import { User } from '@entity/user.entity';
import { Category } from '@entity/category.entity';
import { Item } from '@entity/item.entity';
import { Sale } from '@entity/sale.entity';
import { SaleItem } from '@entity/sale_items.entity';
import { Order } from '@entity/order.entity';
import { ItemOrder } from '@entity/item_order.entity';
import { Invoice } from '@entity/invoice.entity';
import { Warehouse } from '@entity/warehouse.entity';

import { SaleLog } from '@entity/sale_log.entity';
import { ItemLog } from '@entity/item_log.entity';
import { WarehouseLog } from '@entity/warehouse_log.entity';
import { CategoryLog } from '@entity/category_log.entity';
import { PriceLog } from '@entity/price_log.entity';

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
                // entities: [
                //     // "../*/entity/*.entity.ts",
                //     User,
                //     Role,
                //     CategoryLog,
                //     Category,
                //     ItemLog,
                //     Item,
                //     SaleLog,
                //     Sale,
                //     SaleItem,
                //     Order,
                //     ItemOrder,
                //     Invoice,
                //     WarehouseLog,
                //     Warehouse,
                //     PriceLog
                // ],
                autoLoadEntities: true,
                // configService.get<string>('database.username')
                //WARNING: Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
                synchronize: true
            })
        })
    ],
    exports: [TypeOrmModule, ConfigModule]
})
export class CoreModule {}