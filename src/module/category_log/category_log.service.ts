import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryLog } from './category_log.entity';
import { EntityManager, InsertResult, Like, Repository } from 'typeorm';
import { BodyCreateCategoryLog } from './category_log.dto';

@Injectable()
export class CategoryLogService {
  constructor(
    @InjectRepository(CategoryLog)
    private categoryLogRepository: Repository<CategoryLog>
  ) {}

  async getAll(name?: string): Promise<CategoryLog[]> {
    if (name)
      return await this.categoryLogRepository.find({
        where: { name: Like('%' + name + '%') }
      });
    return await this.categoryLogRepository.find();
  }

  async getById(id: number): Promise<CategoryLog> {
    return await this.categoryLogRepository.findOne(id);
  }

  async create(
    transactionEntityManager: EntityManager,
    data: BodyCreateCategoryLog
  ): Promise<InsertResult> {
    const result = await transactionEntityManager.insert(CategoryLog, data);
    if (!result.raw.affectedRows)
      throw new HttpException(
        'The category log cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return result;
  }
}
