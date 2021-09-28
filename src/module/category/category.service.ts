import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { InsertResult, Like, Repository, UpdateResult } from 'typeorm';
import { CategoryLog } from '@module/category_log/category_log.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(CategoryLog)
    private categoryLogRepository: Repository<CategoryLog>
  ) {}

  async findOne(name: string): Promise<Category | undefined> {
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
    return await this.categoryRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async create(name: string, user_id: number): Promise<InsertResult> {
    const isCategoryExists = await this.findOne(name);
    if (isCategoryExists) {
      throw new HttpException(
        'The category already in use',
        HttpStatus.CONFLICT
      );
    }

    let newCategory = new Category();
    newCategory.name = name;
    newCategory.user = user_id;
    const result = await this.categoryRepository.insert(newCategory);
    if (!result) {
      throw new HttpException(
        'The category cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const category = await this.getById(result.raw.insertId);
    const newCategoryLog = new CategoryLog();
    newCategoryLog.category_id = category.id;
    newCategoryLog.name = category.name;
    newCategoryLog.created_by = user_id;
    await this.categoryLogRepository.insert(newCategoryLog);

    return result;
  }

  async update(
    id: number,
    name: string,
    user_id: number
  ): Promise<UpdateResult> {
    const isCategoryExists = await this.findOne(name);
    if (isCategoryExists) {
      throw new HttpException(
        'The category already in use',
        HttpStatus.CONFLICT
      );
    }

    const category = await this.categoryRepository.findOne({
      where: { id: id }
    });
    if (!category)
      throw new HttpException('Category is not found', HttpStatus.NOT_FOUND);

    category.name = name || category.name;
    category.user = user_id;

    const result = await this.categoryRepository.update(id, category);

    if (!result) {
      throw new HttpException(
        'The category cannot update',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const newCategoryLog = new CategoryLog();
    newCategoryLog.category_id = id;
    newCategoryLog.name = category.name;
    newCategoryLog.created_by = user_id;
    await this.categoryLogRepository.insert(newCategoryLog);

    return result;
  }
}
