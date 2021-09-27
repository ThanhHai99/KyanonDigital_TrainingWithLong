import {
  Controller,
  Get,
  Res,
  Param,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  HttpStatus
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoryLogService } from '@module/category_log/category_log.service';
import { CategoryLog } from '@module/category_log/category_log.entity';
import {
  BodyCreateCategory,
  BodyUpdateCategory,
  ResponseCreateCategory,
  ResponseGetCategory,
  ResponseUpdateCategory
} from './category.dto';
import { getConnection } from 'typeorm';
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';

@ApiTags('category')
@Controller('category')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryLogService: CategoryLogService
  ) {}

  @ApiOkResponse({ description: 'Get all categories' })
  @Get()
  async getAll(@Res() res, @Request() req): Promise<ResponseGetCategory> {
    try {
      console.log('req.user');
      console.log(req.user);
      let categories: Category[] = await this.categoryService.getAll();
      if (!categories || categories.length === 0) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
        errors: 0,
        data: categories
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    }
  }

  @ApiOkResponse({ description: "Get a category by category's id" })
  @Get(':id')
  async getById(
    @Res() res,
    @Param('id') id: number
  ): Promise<ResponseGetCategory> {
    try {
      let category: Category = await this.categoryService.getById(id);

      if (!category) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
        errors: 0,
        data: category
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    }
  }

  @ApiCreatedResponse({
    type: BodyCreateCategory,
    description: 'The record has been successfully created.'
  })
  @ApiBody({ type: BodyCreateCategory })
  @Post()
  async create(
    @Body() body: BodyCreateCategory,
    @Res() res
  ): Promise<ResponseCreateCategory> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    // Start transaction
    await queryRunner.startTransaction();
    try {
      let newCategory = new Category();
      newCategory.name = body.name;
      newCategory.user = res.locals.jwtPayload.userId; // Get from token

      const isNameExisting: boolean =
        await this.categoryService.isNameAlreadyInUse(newCategory.name);

      if (isNameExisting) {
        return res.status(409).json({
          error: 1,
          data: 'Category already exists'
        });
      }

      const category = await this.categoryService.create(newCategory);
      // Create category log
      let newCategoryLog = new CategoryLog();
      newCategoryLog.category_id = category.id;
      newCategoryLog.name = category.name;
      newCategoryLog.created_by = res.locals.jwtPayload.userId; // Get from token
      await this.categoryLogService.create(newCategoryLog);

      // commit transaction
      await queryRunner.commitTransaction();
      return res.status(201).json({
        error: 0,
        data: category
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    } finally {
      await queryRunner.release();
    }
  }

  @ApiCreatedResponse({
    type: BodyUpdateCategory,
    description: 'The record has been successfully updated.'
  })
  @ApiOkResponse({ description: 'Update a category' })
  @ApiBody({ type: BodyUpdateCategory })
  @Patch(':id')
  async update(
    @Body() body: BodyUpdateCategory,
    @Res() res,
    @Param('id') id: number
  ): Promise<ResponseUpdateCategory> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    // Start transaction
    await queryRunner.startTransaction();
    try {
      let _category: Category = await this.categoryService.getById(id);

      if (!_category) {
        return res.status(404).json({
          error: 1,
          message: 'Category is not found'
        });
      }

      _category.name = !!body.name ? body.name : _category.name;
      _category.user = res.locals.jwtPayload.userId; // Get from token

      const isNameExisting: boolean =
        await this.categoryService.isNameAlreadyInUse(body.name);

      if (isNameExisting) {
        return res.status(409).json({
          error: 1,
          message: 'Name already exists'
        });
      }

      const category: Category = await this.categoryService.update(
        _category.id,
        _category
      );
      // Create category log
      let newCategoryLog = new CategoryLog();
      newCategoryLog.category_id = category.id;
      newCategoryLog.name = category.name;
      newCategoryLog.created_by = res.locals.jwtPayload.userId; // Get from token
      await this.categoryLogService.create(newCategoryLog);

      // commit transaction
      await queryRunner.commitTransaction();
      return res.status(HttpStatus.OK).json({
        error: 0,
        data: category
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    } finally {
      await queryRunner.release();
    }
  }
}