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
    ApiBasicAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { Category } from 'src/modules/category/entity/categories.entity';
import { CategoryService } from '../service/categories.service';
import { CategoryLogService } from 'src/modules/category_log/service/category_logs.service';
import { CategoryLog } from 'src/modules/category_log/entity/category_logs.entity';
import {
    BodyCreateCategory,
    BodyUpdateCategory,
    ResponseCreateCategory,
    ResponseGetCategory,
    ResponseUpdateCategory
} from 'src/modules/category/dto/category.dto';

@ApiTags('categories')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('categories')
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

    @ApiOkResponse({ description: 'Create a category' })
    @ApiBody({ type: BodyCreateCategory })
    @Post()
    @ApiResponse({ status: 400, description: 'Not allowed to create' })
    @ApiResponse({ status: 500, description: 'Server occurred an error' })
    @ApiCreatedResponse({
        description: '',
        type: Category
    })
    async create(
        @Body() body: BodyCreateCategory,
        @Response() res
    ): Promise<ResponseCreateCategory> {
        let newCategory = new Category();
        newCategory.name = body.name;
        newCategory.user = res.locals.jwtPayload.userId; // Get from token

        const isNameExisting: boolean = await this.categoryService.isNameAlreadyInUse(
            newCategory.name
        );

        if (isNameExisting) {
            return res.status(409).json({
                error: 1,
                data: 'Category already exists'
            });
        }

        try {
            const category = await this.categoryService.create(newCategory);
            // Create category log
            let newCategoryLog = new CategoryLog();
            newCategoryLog.category_id = category.id;
            newCategoryLog.name = category.name;
            newCategoryLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.categoryLogService.create(newCategoryLog);

            return res.status(201).json({
                error: 0,
                data: category
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: 'Update a category' })
    @ApiBody({ type: BodyUpdateCategory })
    @Patch(':id')
    async update(
        @Body() body: BodyUpdateCategory,
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseUpdateCategory> {
        let _category: Category = await this.categoryService.getById(id);

        if (!_category) {
            return res.status(404).json({
                error: 1,
                message: 'Category is not found'
            });
        }

        _category.name = !!body.name ? body.name : _category.name;
        _category.user = res.locals.jwtPayload.userId; // Get from token

        const isNameExisting: boolean = await this.categoryService.isNameAlreadyInUse(
            body.name
        );

        if (isNameExisting) {
            return res.status(409).json({
                error: 1,
                message: 'Name already exists'
            });
        }

        try {
            const category: Category = await this.categoryService.update(
                _category
            );
            // Create category log
            let newCategoryLog = new CategoryLog();
            newCategoryLog.category_id = category.id;
            newCategoryLog.name = category.name;
            newCategoryLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.categoryLogService.create(newCategoryLog);
            return res.status(200).json({
                error: 0,
                data: category
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
