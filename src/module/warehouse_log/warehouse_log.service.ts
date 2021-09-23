import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseLog } from './warehouse_log.entity';

@Injectable()
export class WarehouseLogService {
    constructor(
        @InjectRepository(WarehouseLog)
        private warehouseLogRepository: Repository<WarehouseLog>
    ) {}

    async getAll(): Promise<WarehouseLog[]> {
        return await this.warehouseLogRepository.find();
    }

    async getById(id: number): Promise<WarehouseLog> {
        return await this.warehouseLogRepository.findOne(id);
    }

    async create(warehouseLog: WarehouseLog): Promise<WarehouseLog> {
        return await this.warehouseLogRepository.save(warehouseLog);
    }
}
