import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleLog } from 'src/entities/sale_logs.entity';
import { Repository } from 'typeorm';

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
