import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SaleItem } from './sale_item.entity'
import { SaleItemService } from './sale_item.service'

@Module({
  imports: [TypeOrmModule.forFeature([SaleItem])],
  providers: [SaleItemService],
  exports: [TypeOrmModule, SaleItemService]
})
export class SaleItemModule {}
