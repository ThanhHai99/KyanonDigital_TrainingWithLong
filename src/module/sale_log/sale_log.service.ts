import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { SaleLog } from './sale_log.entity';

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

  async create(
    name: string,
    saleId: number,
    itemId: string,
    startDate: Date,
    endDate: Date,
    amount: string,
    discount: number,
    applied: boolean,
    code: string,
    userId: number
  ): Promise<InsertResult> {
    const newSaleLog = new SaleLog();
    newSaleLog.name = name;
    newSaleLog.sale = saleId;
    newSaleLog.sale_item = itemId;
    newSaleLog.start_date = startDate;
    newSaleLog.end_date = endDate;
    newSaleLog.amount = amount;
    newSaleLog.discount = discount;
    newSaleLog.applied = applied;
    newSaleLog.code = code;
    newSaleLog.created_by = userId;
    const result = await this.saleLogRepository.insert(newSaleLog);
    if (!result)
      throw new HttpException(
        'The sale log cannot create',
        HttpStatus.BAD_REQUEST
      );
    return result;
  }
}
