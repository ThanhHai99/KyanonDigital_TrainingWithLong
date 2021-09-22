import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { SaleItem } from '@entity/sale_items.entity';

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

    // async findByItemIdAndAmount(
    //     itemId: number,
    //     amount: number
    // ): Promise<SaleItem> {
    //     const _saleItem = await this.saleItemRepository.findOne({
    //         where: {
    //             amount: amount,
    //             item_id: itemId
    //         }
    //     });
    //     if (!_saleItem) return null;
    //     return _saleItem;
    // }

    async create(sale_item: SaleItem): Promise<SaleItem> {
        return await this.saleItemRepository.save(sale_item);
    }

    // async update(id: number, item: number, amount: number): Promise<SaleItem> {
    //     let _sale_item = await this.saleItemRepository.findOne(id);
    //     _sale_item.item_id = !!item ? item : _sale_item.item_id;
    //     _sale_item.amount = !!amount ? amount : _sale_item.amount;

    //     await this.saleItemRepository.save(_sale_item);
    //     // return await this.saleItemRepository.findOne(id, {
    //     //     join: {
    //     //         alias: 'sale_item',
    //     //         leftJoinAndSelect: {
    //     //             role: 'sale_item.sale'
    //     //         }
    //     //     }
    //     // });
    //     // await this.saleItemRepository.save(sale_item);
    //     return await this.getById(id);
    // }

    async updateAmount(saleItemId: number, amount: number): Promise<any> {
        const _saleItem = await this.saleItemRepository.findOne(saleItemId);
        const tmp = _saleItem.amount - amount;
        await this.saleItemRepository.update(saleItemId, { amount: tmp });
    }
}
