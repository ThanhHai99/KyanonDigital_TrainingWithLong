import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleItem } from '@entity/sale_items.entity';
import { SaleItemService } from '@service/sale_item.service';

@Module({
    imports: [TypeOrmModule.forFeature([SaleItem])],
    providers: [SaleItemService],
    exports: [TypeOrmModule.forFeature([SaleItem]), SaleItemService]
})
export class SaleItemModule {}
