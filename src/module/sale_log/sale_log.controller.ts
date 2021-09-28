import { Controller, Get, Res, Param, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SaleLogService } from './sale_log.service';

@ApiTags('sale_log')
@Controller('sale_log')
export class SaleLogController {
  constructor(private saleLogService: SaleLogService) {}

  @ApiOkResponse({ description: 'Get all sale log' })
  @Get()
  async getAll(@Res() res) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.saleLogService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get a sale log by id' })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.saleLogService.getById(id)
    });
  }
}
