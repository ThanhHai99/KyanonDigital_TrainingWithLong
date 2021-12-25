import { Controller, Get, Res, Param, Post, Body, Patch, HttpStatus, UseGuards, Req } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { BodyCreateSale, BodyUpdateSale } from './sale.dto'
import { SaleService } from './sale.service'
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard'
import { RolesGuard } from '@module/role/guards/role.guard'
import { Roles } from 'decorator/role/role.decorator'
import { EnumRole as Role } from '@constant/role/role.constant'
import { getConnection } from 'typeorm'
import { BodyCreateSaleItem } from '@module/sale_item/sale_item.dto'

@ApiTags('sale')
@Controller('sale')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @ApiOkResponse({ description: 'Get all sales' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.saleService.getAll()
    })
  }

  @ApiOkResponse({ description: 'Get a sale by id' })
  @Roles(Role.super_admin)
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.saleService.getById(id)
    })
  }

  @ApiCreatedResponse({
    type: BodyCreateSale,
    description: 'The record has been successfully created.'
  })
  @ApiBody({ type: BodyCreateSale })
  @Post()
  async create(
    @Body() bodyCreateSale: BodyCreateSale,
    @Body() bodyCreateSaleItem: BodyCreateSaleItem,
    @Res() res,
    @Req() req
  ): Promise<any> {
    await getConnection().transaction(async (transactionManager) => {
      bodyCreateSale.user = req.user.id
      await this.saleService.create(transactionManager, bodyCreateSale, bodyCreateSaleItem)
    })

    return res.status(HttpStatus.CREATED).json({
      errors: 0,
      message: 'Sale is created'
    })
  }

  @ApiCreatedResponse({
    type: BodyUpdateSale,
    description: 'The record has been successfully updated.'
  })
  @ApiBody({ type: BodyUpdateSale })
  @Roles(Role.super_admin)
  @Patch(':id')
  async update(@Body() body: BodyUpdateSale, @Res() res, @Req() req, @Param('id') id: number): Promise<any> {
    await getConnection().transaction(async (transactionManager) => {
      // const { name, start_date, end_date, discount, applied, code } = body;
      body.user = req.user.id
      await this.saleService.update(transactionManager, id, body)
    })

    return res.status(HttpStatus.OK).json({
      errors: 0,
      message: 'Sale is updated'
    })
  }
}
