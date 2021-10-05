import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    itemId: number,
    name: string,
    categoryId: any,
    detail: string,
    userManual: string,
    userId: number
  ): Promise<ItemLog> {
    const newItemLog = new ItemLog();
    newItemLog.item = itemId;
    newItemLog.name = name;
    newItemLog.category = categoryId;
    newItemLog.detail = detail;
    newItemLog.user_manual = userManual;
    newItemLog.created_by = userId;
    const result = await this.itemLogRepository.save(newItemLog);
    if (!result)
      throw new HttpException(
        'The item log cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return result;
  }
}
