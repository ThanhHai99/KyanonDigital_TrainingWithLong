import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemLog } from 'src/entities/item_logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemLogService {
    constructor(
        @InjectRepository(ItemLog)
        private itemLogRepository: Repository<ItemLog>
    ) {}

    async getAll(): Promise<ItemLog[]> {
        return await this.itemLogRepository.find();
    }

    async getById(id: number): Promise<ItemLog> {
        return await this.itemLogRepository.findOne(id);
    }

    async create(itemLog: ItemLog): Promise<ItemLog> {
        return await this.itemLogRepository.save(itemLog);
    }
}
