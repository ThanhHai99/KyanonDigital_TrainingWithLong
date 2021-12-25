import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { BodyImporting } from './warehouse.dto'
import { WarehouseService } from './warehouse.service'
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard'
import { Roles } from 'decorator/role/role.decorator'
import { EnumRole as Role } from '@constant/role/role.constant'
import { RolesGuard } from '@module/role/guards/role.guard'
import { getConnection } from 'typeorm'

@ApiTags('warehouse')
@Controller('warehouse')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @ApiOkResponse({ description: 'Get all item in warehouse' })
  @Roles(Role.super_admin, Role.warehouse_manager)
  @Get()
  async getAll(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.warehouseService.getAll()
    })
  }

  // @ApiOkResponse({ description: "Get a warehouse by warehouse's id" })
  // @Roles(Role.super_admin)
  // @Get(':id')
  // async getById(
  //   @Res() res,
  //   @Param('id') id: number
  // ): Promise<ResponseGetWarehouse> {
  //   return res.status(HttpStatus.OK).json({
  //     errors: 0,
  //     data: await this.warehouseService.getById(id)
  //   });
  // }

  @ApiOkResponse({ description: 'Get all item inventory' })
  @Roles(Role.super_admin, Role.warehouse_manager)
  @Get('inventory')
  async getInventory(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      error: 0,
      data: await this.warehouseService.getInventory()
    })
  }

  @ApiCreatedResponse({
    type: BodyImporting,
    description: 'The record has been successfully created.'
  })
  @ApiBody({ type: BodyImporting })
  @Roles(Role.super_admin, Role.warehouse_manager)
  @Post('importing')
  async importing(@Body() body: BodyImporting, @Res() res, @Req() req): Promise<any> {
    await getConnection().transaction(async (transactionManager) => {
      body.user = req.user.id
      await this.warehouseService.create(transactionManager, body)
    })

    return res.status(HttpStatus.CREATED).json({
      error: 0,
      data: 'The warehouse is created'
    })
  }
}
