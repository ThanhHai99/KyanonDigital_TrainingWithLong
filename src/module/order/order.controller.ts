import {
  Controller,
  Get,
  Res,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { BodyPayment } from './order.dto';
import { BodyCreateOrder } from './order.dto';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';
import { RolesGuard } from '@module/role/guards/role.guard';
import { Roles } from 'decorator/role/role.decorator';
import { EnumRole as Role } from '@constant/role/role.constant';

@ApiTags('order')
@Controller('order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOkResponse({ description: 'Get all orders' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.orderService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get a order by id' })
  @Roles(Role.super_admin)
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.orderService.getById(id)
    });
  }

  @ApiCreatedResponse({
    type: BodyCreateOrder,
    description: 'The record has been successfully created.'
  })
  @ApiBody({ type: BodyCreateOrder })
  @Post()
  @ApiCreatedResponse({
    description: '',
    type: Order
  })
  async create(
    @Body() body: BodyCreateOrder,
    @Res() res,
    @Req() req
  ): Promise<any> {
    const { payment_method, delivery_address, item, amount } = body;
    await this.orderService.create(
      payment_method,
      delivery_address,
      item,
      amount,
      req.user.id
    );
    return res.status(HttpStatus.CREATED).json({
      error: 0,
      data: 'The order is created'
    });
  }

  @ApiCreatedResponse({
    type: BodyPayment,
    description: 'The record has been successfully updated.'
  })
  @ApiBody({ type: BodyPayment })
  @Patch(':id')
  async update(
    @Body() body: BodyPayment,
    @Res() res,
    @Req() req,
    @Param('id') id: number
  ): Promise<any> {
    await this.orderService.update(id, body.sale_code, req.user.id);

    return res.status(HttpStatus.OK).json({
      error: 0,
      message: 'Exporting successful'
    });
  }

  @ApiOkResponse({ description: 'Pay a order' })
  @Roles(Role.super_admin)
  @Delete(':id')
  async delete(@Res() res, @Param('id') id: number): Promise<any> {
    await this.orderService.delete(id);
    return res.status(HttpStatus.OK).json({
      error: 0,
      message: 'This order is paid'
    });
  }
}
