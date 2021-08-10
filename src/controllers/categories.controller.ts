import { Controller, Get, Response, Param, Post, Body, Patch } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { CreateCategoryDto } from 'src/dto/create_category.dto';
import { Category } from 'src/entities/categories.entity';
import { CategoryService } from '../services/categories.service';
import { validate } from 'class-validator';
import { UpdateCategoryDto } from 'src/dto/update_category.dto';

@ApiTags('categories')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @ApiOkResponse({ description: 'Get all categories' })
    @Get()
    async readAll(@Response() res) {
        try {
            let categories: Category[] = await this.categoryService.getAll();
            if (!categories) {
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
    async readById(@Response() res, @Param('id') id: number) {
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

    @ApiBody({ type: CreateCategoryDto })
    @Post()
    @ApiResponse({ status: 400, description: 'Not allowed to create' })
    @ApiResponse({ status: 500, description: 'Server occurred an error' })
    @ApiCreatedResponse({
        description: '0',
        type: Category
    })
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Response() res
    ): Promise<any> {
        let newCategory: Category = new Category();
        newCategory.name = createCategoryDto.name;
        newCategory.user = <any> res.locals.jwtPayload.userId; // Get from token

        const errors = await validate(newCategory);
        if (errors.length > 0) {
            return res.status(400).json({
                error: 1,
                data: errors
            });
        }

        const isNameExisting =
            await this.categoryService.isNameAlreadyInUse(newCategory.name);

        if (isNameExisting) {
            return res.status(409).json({
                error: 1,
                data: 'Name already exists'
            });
        }

        try {
            const category = await this.categoryService.create(newCategory);
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

    @Patch()
    async update(
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Response() res
    ): Promise<any> {
        let _category: Category = await this.categoryService._findOne(updateCategoryDto.id);
        _category.name = !!updateCategoryDto.name ? updateCategoryDto.name : _category.name;

        const errors = await validate(_category);
        if (errors.length > 0) {
            return res.status(400).json({
                error: 1,
                data: errors
            });
        }

        try {
            const category: Category = await this.categoryService.update(_category);
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
