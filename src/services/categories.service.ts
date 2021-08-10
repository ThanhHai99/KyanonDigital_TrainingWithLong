import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {};

    async _findOne(id: number): Promise<Category> {
        return await this.categoryRepository.findOne(id);
    }

    async getAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
    };

    async getById(id: number): Promise<Category> {
        return await this.categoryRepository.findOne(id);
    };

    async isNameAlreadyInUse(name: string): Promise<boolean> {
        try {
            const user = await this.categoryRepository.findOneOrFail({
                where: {
                    name: name
                }
            });
            if (user) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async create(category: Category): Promise<Category> {
        return await this.categoryRepository.save(category);
    }

    async update(category: Category): Promise<Category> {
        await this.categoryRepository.save(category);
        return await this._findOne(category.id);
    }
};
