import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isArraysSameLength } from '@shared/utils/array'
import { EntityManager, Repository } from 'typeorm'
import { BodyCreateItemOrder } from './item_order.dto'
import { ItemOrder } from './item_order.entity'

@Injectable()
export class ItemOrderService {
  constructor(
    @InjectRepository(ItemOrder)
    private itemOrderRepository: Repository<ItemOrder>
  ) {}

  async getAll(): Promise<ItemOrder[]> {
    return await this.itemOrderRepository.find()
  }

  async getById(id: number): Promise<ItemOrder> {
    return await this.itemOrderRepository.findOne(id)
  }

  async create(transactionEntityManager: EntityManager, data: BodyCreateItemOrder): Promise<any> {
    // Check data is valid
    if (data.item.length < 1 || !isArraysSameLength(data.item, data.amount))
      throw new HttpException('The data is invalid', HttpStatus.BAD_REQUEST)

    for (let i = 0; i < data.item.length; i++) {
      await transactionEntityManager
        .insert(ItemOrder, {
          item: data.item[i],
          amount: data.amount[i],
          order: data.order
        })
        .catch((reject) => {
          throw new HttpException('The order cannot create', HttpStatus.INTERNAL_SERVER_ERROR)
        })
    }
  }
}
