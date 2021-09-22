import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemLogController } from '@controller/item_log.controller';
import { ItemLog } from '@entity/item_log.entity';
import { ItemLogService } from '@service/item_log.service';

@Module({
    imports: [TypeOrmModule.forFeature([ItemLog])],
    controllers: [ItemLogController],
    providers: [ItemLogService],
    exports: [ItemLogService]
})
export class ItemLogModule {}
