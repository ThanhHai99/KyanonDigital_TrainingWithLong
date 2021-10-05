import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Raw, Repository, UpdateResult } from 'typeorm';
import { SaleItem } from './sale_item.entity';

@Injectable()
export class SaleItemService {
  constructor(
    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>
  ) {}

  async findItemAndAmountBySaleId(saleId: number): Promise<any> {
    return await this.saleItemRepository.find({
      where: {
        sale: saleId
      },
      join: {
        alias: 'sale_item',
        leftJoinAndSelect: {
          item: 'sale_item.item'
        }
      }
    });
  }

  async create(
    saleId: number,
    itemId: number,
    amount: number
  ): Promise<InsertResult> {
    const newSaleItem = new SaleItem();
    newSaleItem.sale = saleId;
    newSaleItem.item = itemId;
    newSaleItem.amount = amount;
    const result = await this.saleItemRepository.insert(newSaleItem);
    if (!result)
      throw new HttpException(
        'The sale item cannot create',
        HttpStatus.BAD_REQUEST
      );

    return result;
  }

  async isItemStillOnSale(saleId: number, itemId: number): Promise<boolean> {
    const saleItem = await this.saleItemRepository.findOne({
      where: {
        sale: saleId,
        item: itemId,
        amount: Raw((alias) => `${alias} IS NULL OR ${alias} > 0`)
      }
    });
    if (saleItem) return true;
    return false;
  }

  async updateAmount(
    saleId: number,
    itemId: number,
    amount: number
  ): Promise<UpdateResult> {
    const saleItem = await this.saleItemRepository.findOne({
      where: {
        sale: saleId,
        item: itemId
      }
    });

    if (!saleItem.amount) return null;

    const newAmount = saleItem.amount - amount;
    const result = await this.saleItemRepository.update(saleItem.id, {
      amount: newAmount
    });
    if (!result)
      throw new HttpException(
        'The sale item cannot update',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return result;
  }
}
