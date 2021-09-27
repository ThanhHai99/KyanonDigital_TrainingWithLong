import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { WarehouseLogService } from '@module/warehouse_log/warehouse_log.service';
import { BodyImporting } from './warehouse.dto';
import { Warehouse } from './warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';
const moment = require('moment');

@ApiTags('warehouse')
@Controller('warehouse')
@UseGuards(JwtAuthGuard)
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly warehouseLogService: WarehouseLogService
  ) {}

  @ApiOkResponse({ description: 'Get all item in warehouse' })
  @Get()
  async getAll(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.warehouseService.getAll()
    });
  }

  // @ApiOkResponse({ description: "Get a warehouse by warehouse's id" })
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
  @Get('inventory')
  async getInventory(@Res() res): Promise<any> {
    const sub = moment().subtract(1, 'months').format('YYYY-MM-DD');
    return res.status(HttpStatus.OK).json({
      error: 0,
      data: await this.warehouseService.getInventory(sub.toString())
    });
  }

  @ApiCreatedResponse({
    type: BodyImporting,
    description: 'The record has been successfully created.'
  })
  @ApiBody({ type: BodyImporting })
  @Post('importing')
  async importing(
    @Body() body: BodyImporting,
    @Res() res,
    @Req() req
  ): Promise<any> {
    const { item_id, amount, expiration_date, price } = body;
    const warehouse: Warehouse = await this.warehouseService.create(
      item_id,
      amount,
      expiration_date
    );

    const { id: warehouse_id } = warehouse;
    await this.warehouseLogService.create(
      '+',
      item_id,
      warehouse_id,
      amount,
      price,
      expiration_date,
      req.user.id
    );

    return res.status(201).json({
      error: 0,
      data: warehouse
    });
  }
}
