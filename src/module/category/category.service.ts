import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import {
  EntityManager,
  InsertResult,
  Like,
  Repository,
  UpdateResult
} from 'typeorm';
import { CategoryLogService } from '@module/category_log/category_log.service';
import { BodyCreateCategory, BodyUpdateCategory } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryLogService: CategoryLogService,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async findByName(name: string): Promise<Category | undefined> {
    return await this.categoryRepository.findOne({ where: { name: name } });
  }

  async getAll(name?: string): Promise<Category[]> {
    if (name)
      return await this.categoryRepository.find({
        where: { name: Like('%' + name + '%') }
      });
    return await this.categoryRepository.find();
  }

  async getById(id: number): Promise<Category> {
    return await this.categoryRepository.findOne(id);
  }

  async create(
    transactionEntityManager: EntityManager,
    data: BodyCreateCategory,
    userId: number
  ): Promise<InsertResult> {
    // Check category exists
    const isCategoryExists = await this.findByName(data.name);
    if (isCategoryExists) {
      throw new HttpException(
        'The category already in use',
        HttpStatus.CONFLICT
      );
    }

    // Create category
    data.user = userId;
    const result = await transactionEntityManager.insert(Category, data);
    if (!result.raw.affectedRows) {
      throw new HttpException(
        'The category cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Create category log
    await this.categoryLogService.create(transactionEntityManager, {
      name: data.name,
      created_by: userId,
      category: result.raw.insertId
    });
    return result;
  }

  async update(
    transactionEntityManager: EntityManager,
    id: number,
    data: Partial<BodyUpdateCategory>,
    userId: number
  ): Promise<UpdateResult> {
    // Check category name exists
    const isCategoryExists = await this.findByName(data.name);
    if (isCategoryExists) {
      throw new HttpException(
        'The category already in use',
        HttpStatus.CONFLICT
      );
    }

    // Check category exists
    const category = await this.categoryRepository.findOne(id);
    if (!category)
      throw new HttpException('Category is not found', HttpStatus.NOT_FOUND);

    // Update category
    data.user = userId;
    const result = await transactionEntityManager.update(
      Category,
      { id: id },
      data
    );
    if (!result.affected)
      throw new HttpException(
        'The category cannot update',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    // Create category log
    await this.categoryLogService.create(transactionEntityManager, {
      name: category.name,
      created_by: userId,
      category: id
    });
    return result;
  }
}
