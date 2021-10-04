import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { Sale } from './sale.entity';
import { SaleService } from './sale.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleLogModule } from '@module/sale_log/sale_log.module';
import { SaleItemModule } from '@module/sale_item/sale_item.module';
import { ItemModule } from '@module/item/item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale]),
    SaleLogModule,
    SaleItemModule,
    ItemModule
  ],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [TypeOrmModule, SaleService]
})
export class SaleModule {}
