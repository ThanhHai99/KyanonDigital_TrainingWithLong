import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryLog } from './category_log.entity';
import { EntityManager, Like, Repository, Transaction } from 'typeorm';

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
    categoryId: number,
    name: string,
    userId: number
  ): Promise<CategoryLog> {
    const newCategoryLog = new CategoryLog();
    newCategoryLog.category = categoryId;
    newCategoryLog.name = name;
    newCategoryLog.created_by = userId;
    const result = await transactionEntityManager.save(newCategoryLog);
    if (!result)
      throw new HttpException(
        'The category log cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return result;
  }
}
