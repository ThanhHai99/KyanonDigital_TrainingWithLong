import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';
import {
  Controller,
  Get,
  Res,
  Param,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PriceLogService } from './price_log.service';

@ApiTags('price_log')
@Controller('price_log')
@UseGuards(JwtAuthGuard)
export class PriceLogController {
  constructor(private priceLogService: PriceLogService) {}

  @ApiOkResponse({ description: 'Get all prices log' })
  @Get()
  async getAll(@Res() res) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.priceLogService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get a price log by id' })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.priceLogService.getById(id)
    });
  }
}
