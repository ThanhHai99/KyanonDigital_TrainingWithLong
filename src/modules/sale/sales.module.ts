import { Module } from '@nestjs/common';
import { SaleController } from './controller/sales.controller';
import { Sale } from './entity/sales.entity';
import { SaleService } from './service/sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleLogController } from 'src/modules/sale_log/controller/sale_logs.controller';
import { SaleLogService } from 'src/modules/sale_log/service/sale_logs.service';
import { SaleLog } from 'src/modules/sale_log/entity/sale_logs.entity';
import { SaleItem } from 'src/modules/sale_item/entity/sale_items.entity';
import { SaleItemService } from 'src/modules/sale_item/service/sale_items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleLog, SaleItem])],
  controllers: [SaleController, SaleLogController],
  providers: [SaleService, SaleLogService, SaleItemService]
})
export class SaleModule {}
