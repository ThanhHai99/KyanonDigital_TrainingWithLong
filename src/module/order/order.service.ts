import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

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
        const order = await this.orderRepository.findOne({
            where: {
                id: id,
                paid: true
            }
        });
        if (order) return true;
        return false;
    }

    async isExported(id: number): Promise<boolean> {
        const order = await this.orderRepository.findOne({
            where: {
                id: id,
                exported: true
            }
        });
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

    async payOrder(id: number): Promise<Order> {
        await this.orderRepository.update(id, { paid: true });
        return this.getById(id);
    }

    async exportOrder(id: number): Promise<Order> {
        await this.orderRepository.update(id, { exported: true });
        return this.getById(id);
    }
}
