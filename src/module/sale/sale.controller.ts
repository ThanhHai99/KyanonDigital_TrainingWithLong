import {
  Controller,
  Get,
  Res,
  Param,
  Post,
  Body,
  Patch,
  HttpStatus,
  UseGuards,
  Req
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { BodyCreateSale, BodyUpdateSale } from './sale.dto';
import { SaleService } from './sale.service';
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';

@ApiTags('sale')
@Controller('sale')
@UseGuards(JwtAuthGuard)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @ApiOkResponse({ description: 'Get all sales' })
  @Get()
  async getAll(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.saleService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get a sale by id' })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.saleService.getById(id)
    });
  }

  @ApiCreatedResponse({
    type: BodyCreateSale,
    description: 'The record has been successfully created.'
  })
  @ApiBody({ type: BodyCreateSale })
  @Post()
  async create(
    @Body() body: BodyCreateSale,
    @Res() res,
    @Req() req
  ): Promise<any> {
    const {
      name,
      start_date,
      end_date,
      discount,
      applied,
      code,
      item_id: sale_item,
      amount
    } = body;

    await this.saleService.create(
      name,
      start_date,
      end_date,
      discount,
      applied,
      code,
      req.user.id,
      sale_item,
      amount
    );

    return res.status(HttpStatus.CREATED).json({
      errors: 0,
      message: 'Sale is created'
    });
  }

  @ApiCreatedResponse({
    type: BodyUpdateSale,
    description: 'The record has been successfully updated.'
  })
  @ApiBody({ type: BodyUpdateSale })
  @Patch(':id')
  async update(
    @Body() body: BodyUpdateSale,
    @Res() res,
    @Req() req,
    @Param('id') id: number
  ): Promise<any> {
    const { name, start_date, end_date, discount, applied, code } = body;
    await this.saleService.update(
      id,
      name,
      start_date,
      end_date,
      discount,
      applied,
      code,
      req.user.id
    );

    return res.status(HttpStatus.OK).json({
      errors: 0,
      message: 'Sale is updated'
    });
  }
}
