import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from 'src/modules/item/controller/items.controller';
import { ItemLogController } from 'src/modules/item_log/controller/item_logs.controller';
import { PriceLogController } from 'src/modules/price_log/controller/price_logs.controller';
import { Item } from 'src/modules/item/entity/items.entity';
import { ItemLog } from 'src/modules/item_log/entity/item_logs.entity';
import { PriceLog } from 'src/modules/price_log/entity/price_logs.entity';
import { ItemService } from 'src/modules/item/service/items.service';
import { ItemLogService } from 'src/modules/item_log/service/item_logs.service';
import { PriceLogService } from 'src/modules/price_log/service/price_logs.service';

@Module({
    imports: [TypeOrmModule.forFeature([Item, ItemLog, PriceLog])],
    controllers: [ItemController, ItemLogController, PriceLogController],
    providers: [ItemService, ItemLogService, PriceLogService]
})
export class ItemsModule {}
