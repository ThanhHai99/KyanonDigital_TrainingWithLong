import { SaleLogController } from './sale_log.controller';
import { SaleLog } from './sale_log.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleLogService } from '@module/sale_log/sale_log.service';

@Module({
    imports: [TypeOrmModule.forFeature([SaleLog])],
    controllers: [SaleLogController],
    providers: [SaleLogService],
    exports: [SaleLogService]
})
export class SaleLogModule {}
