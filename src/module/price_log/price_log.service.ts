import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceLog } from './price_log.entity';

@Injectable()
export class PriceLogService {
    constructor(
        @InjectRepository(PriceLog)
        private priceLogRepository: Repository<PriceLog>
    ) {}

    async getAll(): Promise<PriceLog[]> {
        return await this.priceLogRepository.find();
    }

    async getById(id: number): Promise<PriceLog> {
        return await this.priceLogRepository.findOne(id);
    }

    async create(categoryLog: PriceLog): Promise<PriceLog> {
        return await this.priceLogRepository.save(categoryLog);
    }
}
