import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { ItemLogModule } from '@module/item_log/item_log.module';
import { PriceLogModule } from '@module/price_log/price_log.module';
import { Item } from './item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Item]), ItemLogModule, PriceLogModule],
    controllers: [ItemController],
    providers: [ItemService],
    exports: [TypeOrmModule.forFeature([Item]), ItemService]
})
export class ItemModule {}
