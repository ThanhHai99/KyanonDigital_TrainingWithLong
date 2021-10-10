import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BodyCreateItemLog } from './item_log.dto';
import { ItemLog } from './item_log.entity';

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

  async create(
    transactionEntityManager: EntityManager,
    data: BodyCreateItemLog
  ): Promise<any> {
    await transactionEntityManager.insert(ItemLog, data).catch((reject) => {
      throw new HttpException(
        'The item log cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }
}
