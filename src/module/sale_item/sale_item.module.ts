import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleItem } from './sale_item.entity';
import { SaleItemService } from '@module/sale_item/sale_item.service';

@Module({
    imports: [TypeOrmModule.forFeature([SaleItem])],
    providers: [SaleItemService],
    exports: [TypeOrmModule.forFeature([SaleItem]), SaleItemService]
})
export class SaleItemModule {}
