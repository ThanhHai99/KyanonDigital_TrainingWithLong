import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category_Log } from 'src/entities/category_logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryLogService {
    constructor(
        @InjectRepository(Category_Log)
        private categoryLogRepository: Repository<Category_Log>
    ) {}

    async getAll(): Promise<Category_Log[]> {
        return await this.categoryLogRepository.find();
    }

    async getById(id: number): Promise<Category_Log> {
        return await this.categoryLogRepository.findOne(id);
    }

    async create(categoryLog: Category_Log): Promise<Category_Log> {
        return await this.categoryLogRepository.save(categoryLog);
    }
}
