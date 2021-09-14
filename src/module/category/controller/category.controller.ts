import {
    Controller,
    Get,
    Response,
    Param,
    Post,
    Body,
    Patch
} from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { Category } from '../entity/category.entity';
import { CategoryService } from '../service/category.service';
import { CategoryLogService } from '../../category_log/service/category_log.service';
import { CategoryLog } from '../../category_log/entity/category_log.entity';
import {
    BodyCreateCategory,
    BodyUpdateCategory,
    ResponseCreateCategory,
    ResponseGetCategory,
    ResponseUpdateCategory
} from '../dto/category.dto';
import { getConnection } from 'typeorm';

@ApiTags('category')
@ApiSecurity('JwtAuthGuard')
@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly categoryLogService: CategoryLogService
    ) {}

    @ApiOkResponse({ description: 'Get all categories' })
    @Get()
    async readAll(@Response() res): Promise<ResponseGetCategory> {
        try {
            let categories: Category[] = await this.categoryService.getAll();
            if (!categories || categories.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
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
    async readById(
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseGetCategory> {
        try {
            let category: Category = await this.categoryService.getById(id);

            if (!category) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
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
        @Response() res
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
        @Response() res,
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
            return res.status(200).json({
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
