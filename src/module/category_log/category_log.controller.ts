import { Controller, Get, Res, Query, Param, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryLogService } from './category_log.service';

@ApiTags('category_log')
@Controller('category_log')
export class CategoryLogController {
  constructor(private categoryLogService: CategoryLogService) {}

  @ApiOkResponse({ description: 'Get all categories log' })
  @Get()
  async getAll(@Res() res, @Query() query) {
    const { name } = query;
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.categoryLogService.getAll(name)
    });
  }

  @ApiOkResponse({ description: 'Get a category log by id' })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.categoryLogService.getById(id)
    });
  }
}
