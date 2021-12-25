import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Raw, Repository } from 'typeorm'
import { BodyCreateSaleItem } from './sale_item.dto'
import { SaleItem } from './sale_item.entity'

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
    })
  }

  async create(transactionEntityManager: EntityManager, data: BodyCreateSaleItem): Promise<any> {
    for (let i = 0; i < data.item_id.length; i++) {
      await transactionEntityManager
        .insert(SaleItem, {
          sale: data.sale,
          item: data.item_id[i],
          amount: data.amount[i]
        })
        .catch((reject) => {
          throw new HttpException('The sale item cannot create', HttpStatus.BAD_REQUEST)
        })
    }
  }

  async isItemStillOnSale(saleId: number, itemId: number): Promise<boolean> {
    const saleItem = await this.saleItemRepository.findOne({
      where: {
        sale: saleId,
        item: itemId,
        amount: Raw((alias) => `${alias} IS NULL OR ${alias} > 0`)
      }
    })
    if (saleItem) return true
    return false
  }

  async updateAmount(transactionEntityManager: EntityManager, saleId: number, itemId: number, amount: number): Promise<any> {
    const saleItem = await this.saleItemRepository.findOne({
      where: {
        sale: saleId,
        item: itemId
      }
    })

    if (!saleItem.amount) return null

    saleItem.amount -= amount
    await transactionEntityManager.save(saleItem).catch((reject) => {
      throw new HttpException('The sale item cannot update', HttpStatus.INTERNAL_SERVER_ERROR)
    })
  }
}
