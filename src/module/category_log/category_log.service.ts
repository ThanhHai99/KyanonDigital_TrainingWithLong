import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryLog } from './category_log.entity';
import { Like, Repository } from 'typeorm';

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
    return await this.categoryLogRepository.findOne({
      where: {
        id: id
      }
    });
  }
}
