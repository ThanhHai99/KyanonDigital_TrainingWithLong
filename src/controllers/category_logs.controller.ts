import { Controller, Get, Response, Param } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { CategoryLogService } from 'src/services/category_logs.service';
import { Category_Log } from 'src/entities/category_logs.entity';

@ApiTags('category_logs')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('category_logs')
export class CategoryLogController {
    constructor(private categoryLogService: CategoryLogService) {}

    @ApiOkResponse({ description: 'Get all categories log' })
    @Get()
    async readAll(@Response() res) {
        try {
            let categoryLog: Category_Log[] =
                await this.categoryLogService.getAll();
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

    @ApiOkResponse({ description: 'Get a category log by id' })
    @Get(':id')
    async readById(@Response() res, @Param('id') id: number) {
        try {
            let categoryLog: Category_Log =
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
