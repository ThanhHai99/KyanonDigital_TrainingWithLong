import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceLogController } from './controller/price_log.controller';
import { PriceLog } from './entity/price_log.entity';
import { PriceLogService } from './service/price_log.service';

@Module({
    imports: [TypeOrmModule.forFeature([PriceLog])],
    controllers: [PriceLogController],
    providers: [PriceLogService],
    exports: [TypeOrmModule.forFeature([PriceLog]), PriceLogService]
})
export class PriceLogModule {}
