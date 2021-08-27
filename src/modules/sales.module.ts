import { Module } from '@nestjs/common';
import { SaleController } from '../controllers/sales.controller';
import { Sale } from '../entities/sales.entity';
import { SaleService } from '../services/sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleLogController } from 'src/controllers/sale_logs.controller';
import { SaleLogService } from 'src/services/sale_logs.service';
import { SaleLog } from 'src/entities/sale_logs.entity';
import { SaleItem } from 'src/entities/sale_items.entity';
import { SaleItemService } from 'src/services/sale_items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleLog, SaleItem])],
  controllers: [SaleController, SaleLogController],
  providers: [SaleService, SaleLogService, SaleItemService]
})
export class SaleModule {}
