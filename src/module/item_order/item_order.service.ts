import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    async getByOrderId(orderId: number): Promise<any> {
        return await this.itemOrderRepository.find({
            select: ['amount', 'item'],
            where: {
                order: orderId
            },
            join: {
                alias: 'item_order',
                leftJoinAndSelect: {
                    role: 'item_order.item'
                }
            }
        });
    }

    async create(category: ItemOrder): Promise<ItemOrder> {
        return await this.itemOrderRepository.save(category);
    }
}
