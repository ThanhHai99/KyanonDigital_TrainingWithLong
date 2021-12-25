import { JwtAuthGuard } from '@module/auth/guard/jwt.guard'
import { Controller, Get, Res, Param, HttpStatus, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { InvoiceService } from './invoice.service'
import { Roles } from 'decorator/role/role.decorator'
import { EnumRole as Role } from '@constant/role/role.constant'
import { RolesGuard } from '@module/role/guards/role.guard'

@ApiTags('invoice')
@Controller('invoice')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @ApiOkResponse({ description: 'Get all invoices' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.invoiceService.getAll()
    })
  }

  @ApiOkResponse({ description: 'Get a invoice by id' })
  @Roles(Role.super_admin)
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.invoiceService.getById(id)
    })
  }
}
