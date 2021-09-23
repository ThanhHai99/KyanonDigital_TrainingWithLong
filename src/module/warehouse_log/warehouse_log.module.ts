import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseLog } from './warehouse_log.entity';
import { WarehouseLogService } from '@module/warehouse_log/warehouse_log.service';

@Module({
    imports: [TypeOrmModule.forFeature([WarehouseLog])],
    providers: [WarehouseLogService],
    exports: [WarehouseLogService]
})
export class WarehouseLogModule {}
