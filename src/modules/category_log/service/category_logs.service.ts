import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryLog } from 'src/modules/category_log/entity/category_logs.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CategoryLogService {
    constructor(
        @InjectRepository(CategoryLog)
        private categoryLogRepository: Repository<CategoryLog>
    ) {}

    async getAll(): Promise<CategoryLog[]> {
        return await this.categoryLogRepository.find();
    }

    async getById(id: number): Promise<CategoryLog> {
        return await this.categoryLogRepository.findOne(id);
    }

    async getByName(name: string): Promise<CategoryLog[]> {
        return await this.categoryLogRepository.find({
            where: {
                name: Like('%' + name + '%')
            }
        });
    }

    async create(categoryLog: CategoryLog): Promise<CategoryLog> {
        return await this.categoryLogRepository.save(categoryLog);
    }
}
