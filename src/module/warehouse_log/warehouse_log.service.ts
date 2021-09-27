import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
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
    return await this.warehouseLogRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async create(
    status: string,
    item_id: number,
    warehouse_id: number,
    amount: number,
    price: number,
    expiration_date: Date,
    user_id: number
  ): Promise<InsertResult> {
    const newWarehouseLog = new WarehouseLog();
    newWarehouseLog.status = status;
    newWarehouseLog.item_id = item_id;
    newWarehouseLog.warehouse = warehouse_id;
    newWarehouseLog.amount = amount;
    newWarehouseLog.price = price;
    newWarehouseLog.expiration_date = expiration_date;
    newWarehouseLog.created_by = user_id;
    const result = await this.warehouseLogRepository.insert(newWarehouseLog);
    if (!result) {
      throw new HttpException(
        'The account cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }
}
