import { Controller, Get, Res, Param, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SaleLog } from './sale_log.entity';
import { SaleLogService } from './sale_log.service';

@ApiTags('sale_log')
@Controller('sale_log')
export class SaleLogController {
  constructor(private saleLogService: SaleLogService) {}

  @ApiOkResponse({ description: 'Get all sale log' })
  @Get()
  async getAll(@Res() res) {
    try {
      let saleLog: SaleLog[] = await this.saleLogService.getAll();
      if (!saleLog || saleLog.length === 0) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
        errors: 0,
        data: saleLog
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    }
  }

  @ApiOkResponse({ description: 'Get a sale log by id' })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number) {
    try {
      let saleLog: SaleLog = await this.saleLogService.getById(id);

      if (!saleLog) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
        errors: 0,
        data: saleLog
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    }
  }
}
