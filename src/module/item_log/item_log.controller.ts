import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';
import { Controller, Get, Res, Param, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ItemLogService } from './item_log.service';

@ApiTags('item_log')
@Controller('item_log')
@UseGuards(JwtAuthGuard)
export class ItemLogController {
  constructor(private itemLogService: ItemLogService) {}

  @ApiOkResponse({ description: 'Get all items log' })
  @Get()
  async getAll(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.itemLogService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get a item log by id' })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.itemLogService.getById(id)
    });
  }
}
