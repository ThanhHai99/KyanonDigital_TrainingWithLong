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
    return await this.saleLogRepository.findOne({
      where: {
        id: id
      }
    });
  }
}
