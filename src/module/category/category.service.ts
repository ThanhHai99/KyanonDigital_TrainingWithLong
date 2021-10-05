import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Like, Repository } from 'typeorm';
import { CategoryLogService } from '@module/category_log/category_log.service';

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

  async create(name: string, userId: number): Promise<Category> {
    // Check category exists
    const isCategoryExists = await this.findByName(name);
    if (isCategoryExists) {
      throw new HttpException(
        'The category already in use',
        HttpStatus.CONFLICT
      );
    }

    // Create category
    let newCategory = new Category();
    newCategory.name = name;
    newCategory.user = userId;
    const result = await this.categoryRepository.save(newCategory);
    if (!result) {
      throw new HttpException(
        'The category cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Create category log
    await this.categoryLogService.create(result.id, name, userId);

    return result;
  }

  async update(id: number, name: string, userId: number): Promise<Category> {
    // Check category name exists
    const isCategoryExists = await this.findByName(name);
    if (isCategoryExists) {
      throw new HttpException(
        'The category already in use',
        HttpStatus.CONFLICT
      );
    }

    // Check category exists
    const category = await this.categoryRepository.findOne({
      where: { id: id }
    });
    if (!category)
      throw new HttpException('Category is not found', HttpStatus.NOT_FOUND);

    // Update category
    category.name = name || category.name;
    category.user = userId;
    const result = await this.categoryRepository.save(category);
    if (!result) {
      throw new HttpException(
        'The category cannot update',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Create category log
    await this.categoryLogService.create(id, category.name, userId);

    return result;
  }
}
