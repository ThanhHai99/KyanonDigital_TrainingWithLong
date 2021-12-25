import { JwtAuthGuard } from '@module/auth/guard/jwt.guard'
import { Controller, Get, Res, Param, HttpStatus, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SaleLogService } from './sale_log.service'
import { Roles } from 'decorator/role/role.decorator'
import { EnumRole as Role } from '@constant/role/role.constant'
import { RolesGuard } from '@module/role/guards/role.guard'

@ApiTags('sale_log')
@Controller('sale_log')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SaleLogController {
  constructor(private saleLogService: SaleLogService) {}

  @ApiOkResponse({ description: 'Get all sale log' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.saleLogService.getAll()
    })
  }

  @ApiOkResponse({ description: 'Get a sale log by id' })
  @Roles(Role.super_admin)
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.saleLogService.getById(id)
    })
  }
}
