import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { SaleItem } from '../entity/sale_items.entity';

@Injectable()
export class SaleItemService {
    constructor(
        @InjectRepository(SaleItem)
        private saleItemRepository: Repository<SaleItem>
    ) {}

    async getById(id: number): Promise<SaleItem> {
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

    async findItemAndAmountBySaleId(
        saleId: number,
        itemId: number,
        amount: number
    ): Promise<SaleItem> {
        const _saleItem = await this.saleItemRepository.findOne({
            where: {
                sale: saleId,
                item_id: itemId,
                amount: MoreThanOrEqual(amount)
            }
        });
        if (!_saleItem) return null;
        return _saleItem;
    }

    async create(sale_item: SaleItem): Promise<SaleItem> {
        return await this.saleItemRepository.save(sale_item);
    }

    async update(sale_item: SaleItem): Promise<SaleItem> {
        await this.saleItemRepository.save(sale_item);
        return await this.getById(sale_item.id);
    }

    async updateAmount(saleItemId: number, amount: number): Promise<any> {
        const _saleItem = await this.saleItemRepository.findOne(saleItemId);
        const tmp = _saleItem.amount - amount;
        await this.saleItemRepository.update(saleItemId, { amount: tmp });
    }
}
