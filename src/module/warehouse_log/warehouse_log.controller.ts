import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { WarehouseLogService } from '@module/warehouse_log/warehouse_log.service';
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';

@ApiTags('warehouse')
@Controller('warehouse')
@UseGuards(JwtAuthGuard)
export class WarehouseLogController {
  constructor(private readonly warehouseLogService: WarehouseLogService) {}

  @ApiOkResponse({ description: 'Get all warehouse log' })
  @Get()
  async getAll(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.warehouseLogService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get a warehouse log by id' })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.warehouseLogService.getById(id)
    });
  }
}
