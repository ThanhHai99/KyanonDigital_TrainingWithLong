import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleItem } from 'src/entities/sale_items.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SaleItemService {
    constructor(
        @InjectRepository(SaleItem)
        private saleItemRepository: Repository<SaleItem>
    ) {}

    async _findOne(id: number): Promise<SaleItem> {
        return await this.saleItemRepository.findOne(id);
    }

    async getBySaleId(saleId: number): Promise<SaleItem[]> {
        return await this.saleItemRepository.find({
            select: ['item_id'],
            where: {
                sale: <any>saleId
            }
        });
    }

    async create(sale_item: SaleItem): Promise<SaleItem> {
        return await this.saleItemRepository.save(sale_item);
    }

    async update(sale_item: SaleItem): Promise<SaleItem> {
        await this.saleItemRepository.save(sale_item);
        return await this._findOne(sale_item.id);
    }
}
