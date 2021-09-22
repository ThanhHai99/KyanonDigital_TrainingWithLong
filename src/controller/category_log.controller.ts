import { Controller, Get, Response, Query, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CategoryLog } from '@entity/category_log.entity';
import { CategoryLogService } from '@service/category_log.service';

@ApiTags('category_log')
@ApiSecurity('JwtAuthGuard')
@Controller('category_log')
export class CategoryLogController {
    constructor(private categoryLogService: CategoryLogService) {}

    @ApiOkResponse({ description: 'Get all categories log' })
    @Get()
    async readAll(@Response() res, @Query() query) {
        try {
            const { name } = query;
            let category: any;

            if (!!name) {
                category = await this.categoryLogService.getByName(name);
            } else {
                category = await this.categoryLogService.getAll();
            }

            if (!category || category.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            } else {
                return res.status(200).json({
                    errors: 0,
                    data: category
                });
            }
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: 'Get a category log by id' })
    @Get(':id')
    async readById(@Response() res, @Param('id') id: number) {
        try {
            let categoryLog: CategoryLog =
                await this.categoryLogService.getById(id);

            if (!categoryLog) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: categoryLog
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}