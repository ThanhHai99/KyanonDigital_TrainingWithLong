import { Module } from '@nestjs/common';
import { SaleController } from '../controllers/sales.controller';
import { Sale } from '../entities/sales.entity';
import { SaleService } from '../services/sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sale])],
  controllers: [SaleController],
  providers: [SaleService]
})
export class SaleModule {}
