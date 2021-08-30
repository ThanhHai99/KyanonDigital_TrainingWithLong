import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/modules/order/entity/orders.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>
    ) {}

    async getAll(): Promise<Order[]> {
        return await this.orderRepository.find();
    }

    async getById(id: number): Promise<Order> {
        return await this.orderRepository.findOne(id);
    }

    async isPaid(id: number): Promise<boolean> {
        const order = await this.orderRepository.findOneOrFail(id);
        if (order) return true;
        return false;
    }

    async create(order: Order): Promise<Order> {
        return await this.orderRepository.save(order);
    }

    async update(order: Order): Promise<Order> {
        await this.orderRepository.save(order);
        return await this.getById(order.id);
    }
}
