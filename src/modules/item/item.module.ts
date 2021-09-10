import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from './controller/item.controller';
import { ItemService } from './service/item.service';
import { ItemLogModule } from '../item_log/item_log.module';
import { PriceLogModule } from '../price_log/price_log.module';
import { Item } from './entity/item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Item]), ItemLogModule, PriceLogModule],
    controllers: [ItemController],
    providers: [ItemService],
    exports: [TypeOrmModule.forFeature([Item]), ItemService]
})
export class ItemsModule {}
