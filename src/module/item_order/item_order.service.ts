import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ItemOrder } from './item_order.entity';

@Injectable()
export class ItemOrderService {
  constructor(
    @InjectRepository(ItemOrder)
    private itemOrderRepository: Repository<ItemOrder>
  ) {}

  async getAll(): Promise<ItemOrder[]> {
    return await this.itemOrderRepository.find();
  }

  async getById(id: number): Promise<ItemOrder> {
    return await this.itemOrderRepository.findOne(id);
  }

  async create(
    transactionEntityManager: EntityManager,
    itemId: number,
    amount: number,
    orderId: number
  ): Promise<ItemOrder> {
    const newItemOrder = new ItemOrder();
    newItemOrder.item = itemId;
    newItemOrder.amount = amount;
    newItemOrder.order_id = orderId;
    const result = await transactionEntityManager.save(newItemOrder);
    if (!result)
      throw new HttpException(
        'The order cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return result;
  }
}
