import { Controller, Get, Res, Query, Param, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryLog } from './category_log.entity';
import { CategoryLogService } from './category_log.service';

@ApiTags('category_log')
@Controller('category_log')
export class CategoryLogController {
  constructor(private categoryLogService: CategoryLogService) {}

  @ApiOkResponse({ description: 'Get all categories log' })
  @Get()
  async getAll(@Res() res, @Query() query) {
    try {
      const { name } = query;
      let category: any;

      if (!!name) {
        category = await this.categoryLogService.getByName(name);
      } else {
        category = await this.categoryLogService.getAll();
      }

      if (!category || category.length === 0) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      } else {
        return res.status(HttpStatus.OK).json({
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
  async getById(@Res() res, @Param('id') id: number) {
    try {
      let categoryLog: CategoryLog = await this.categoryLogService.getById(id);

      if (!categoryLog) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
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
