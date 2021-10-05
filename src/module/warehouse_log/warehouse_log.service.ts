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
    return await this.warehouseLogRepository.findOne(id);
  }

  async create(
    status: string,
    price: number,
    warehouseId: number,
    itemId: number,
    amount: number,
    expirationDate: Date,
    userId: number
  ): Promise<InsertResult> {
    const newWarehouseLog = new WarehouseLog();
    newWarehouseLog.status = status;
    newWarehouseLog.price = price;
    newWarehouseLog.warehouse = warehouseId;
    newWarehouseLog.item = itemId;
    newWarehouseLog.amount = amount;
    newWarehouseLog.expiration_date = expirationDate;
    newWarehouseLog.created_by = userId;
    const result = await this.warehouseLogRepository.insert(newWarehouseLog);
    if (!result) {
      throw new HttpException(
        'The warehouse log cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }
}
