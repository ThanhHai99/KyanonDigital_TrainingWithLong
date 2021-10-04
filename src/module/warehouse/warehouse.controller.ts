import {
  Body,
  Controller,
  Get,
  HttpStatus,
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
import { BodyImporting } from './warehouse.dto';
import { WarehouseService } from './warehouse.service';
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';

@ApiTags('warehouse')
@Controller('warehouse')
@UseGuards(JwtAuthGuard)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

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
    return res.status(HttpStatus.OK).json({
      error: 0,
      data: await this.warehouseService.getInventory()
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
    await this.warehouseService.create(
      item_id,
      amount,
      expiration_date,
      price,
      req.user.id
    );

    return res.status(HttpStatus.CREATED).json({
      error: 0,
      data: 'The warehouse is created'
    });
  }
}
