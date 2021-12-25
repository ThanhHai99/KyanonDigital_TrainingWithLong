import { JwtAuthGuard } from '@module/auth/guard/jwt.guard'
import { RolesGuard } from '@module/role/guards/role.guard'
import { Controller, Get, Res, Param, HttpStatus, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { PriceLogService } from './price_log.service'
import { Roles } from 'decorator/role/role.decorator'
import { EnumRole as Role } from '@constant/role/role.constant'

@ApiTags('price_log')
@Controller('price_log')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PriceLogController {
  constructor(private priceLogService: PriceLogService) {}

  @ApiOkResponse({ description: 'Get all prices log' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.priceLogService.getAll()
    })
  }

  @ApiOkResponse({ description: 'Get a price log by id' })
  @Roles(Role.super_admin)
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.priceLogService.getById(id)
    })
  }
}
