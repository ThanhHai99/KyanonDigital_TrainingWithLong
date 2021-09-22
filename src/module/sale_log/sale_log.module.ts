import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleLogController } from '@module/sale_log/controller/sale_log.controller';
import { SaleLog } from '@module/sale_log/entity/sale_log.entity';
import { SaleLogService } from '@module/sale_log/service/sale_log.service';

@Module({
    imports: [TypeOrmModule.forFeature([SaleLog])],
    controllers: [SaleLogController],
    providers: [SaleLogService],
    exports: [SaleLogService, TypeOrmModule.forFeature([SaleLog])]
})
export class SaleLogModule {}
