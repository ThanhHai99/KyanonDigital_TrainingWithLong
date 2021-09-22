import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemLogController } from '@module/item_log/controller/item_log.controller';
import { ItemLog } from '@module/item_log/entity/item_log.entity';
import { ItemLogService } from '@module/item_log/service/item_log.service';

@Module({
    imports: [TypeOrmModule.forFeature([ItemLog])],
    controllers: [ItemLogController],
    providers: [ItemLogService],
    exports: [TypeOrmModule.forFeature([ItemLog]), ItemLogService]
})
export class ItemLogModule {}
