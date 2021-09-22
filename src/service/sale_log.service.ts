import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaleLog } from '@entity/sale_log.entity';

@Injectable()
export class SaleLogService {
    constructor(
        @InjectRepository(SaleLog)
        private saleLogRepository: Repository<SaleLog>
    ) {}

    async getAll(): Promise<SaleLog[]> {
        return await this.saleLogRepository.find();
    }

    async getById(id: number): Promise<SaleLog> {
        return await this.saleLogRepository.findOne(id);
    }

    async create(saleLog: SaleLog): Promise<SaleLog> {
        return await this.saleLogRepository.save(saleLog);
    }
}
