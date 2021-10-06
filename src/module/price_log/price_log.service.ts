import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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
    itemId: number,
    price: number,
    userId: number
  ): Promise<PriceLog> {
    const newPriceLog = new PriceLog();
    newPriceLog.item_id = itemId;
    newPriceLog.price = price;
    newPriceLog.created_by = userId;
    const result = await transactionEntityManager.save(newPriceLog);
    if (!result)
      throw new HttpException(
        'The price log cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return result;
  }
}
