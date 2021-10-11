import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BodyCreateWarehouseLog } from './warehouse_log.dto';
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

  async create(
    transactionEntityManager: EntityManager,
    data: BodyCreateWarehouseLog
  ): Promise<any> {
    await transactionEntityManager
      .insert(WarehouseLog, data)
      .catch((reject) => {
        throw new HttpException(
          'The warehouse log cannot create',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }
}
