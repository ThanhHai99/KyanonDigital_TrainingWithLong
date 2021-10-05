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
import { Roles } from 'decorator/role/role.decorator';
import { EnumRole as Role } from '@constant/role/role.constant';
import { RolesGuard } from '@module/role/guards/role.guard';

@ApiTags('warehouse')
@Controller('warehouse')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarehouseLogController {
  constructor(private readonly warehouseLogService: WarehouseLogService) {}

  @ApiOkResponse({ description: 'Get all warehouse log' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.warehouseLogService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get a warehouse log by id' })
  @Roles(Role.super_admin)
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.warehouseLogService.getById(id)
    });
  }
}
