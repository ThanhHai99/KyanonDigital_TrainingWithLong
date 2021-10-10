import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BodyCreatePriceLog } from './price_log.dto';
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

  async create(
    transactionEntityManager: EntityManager,
    data: BodyCreatePriceLog
  ): Promise<any> {
    await transactionEntityManager.insert(PriceLog, data).catch((reject) => {
      throw new HttpException(
        'The price log cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }
}
