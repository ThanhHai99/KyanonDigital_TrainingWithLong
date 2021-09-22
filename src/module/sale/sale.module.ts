import { Module } from '@nestjs/common';
import { SaleController } from '@module/sale/controller/sale.controller';
import { Sale } from '@module/sale/entity/sale.entity';
import { SaleService } from '@module/sale/service/sale.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleLogModule } from '@module/sale_log/sale_log.module';
import { SaleItemModule } from '@module/sale_item/sale_item.module';

@Module({
    imports: [TypeOrmModule.forFeature([Sale]), SaleLogModule, SaleItemModule],
    controllers: [SaleController],
    providers: [SaleService],
    exports: [
        TypeOrmModule.forFeature([Sale]),
        SaleService
    ]
})
export class SaleModule {}
