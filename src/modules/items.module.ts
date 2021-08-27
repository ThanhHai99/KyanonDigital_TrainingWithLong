import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from 'src/controllers/items.controller';
import { ItemLogController } from 'src/controllers/item_logs.controller';
import { PriceLogController } from 'src/controllers/price_logs.controller';
import { Item } from 'src/entities/items.entity';
import { ItemLog } from 'src/entities/item_logs.entity';
import { PriceLog } from 'src/entities/price_logs.entity';
import { ItemService } from 'src/services/items.service';
import { ItemLogService } from 'src/services/item_logs.service';
import { PriceLogService } from 'src/services/price_logs.service';

@Module({
    imports: [TypeOrmModule.forFeature([Item, ItemLog, PriceLog])],
    controllers: [ItemController, ItemLogController, PriceLogController],
    providers: [ItemService, ItemLogService, PriceLogService]
})
export class ItemsModule {}
