import {
  Controller,
  Get,
  Res,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { Invoice } from '@module/invoice/invoice.entity';
import { InvoiceService } from '@module/invoice/invoice.service';
import { ItemService } from '@module/item/item.service';
import { ItemOrder } from '@module/item_order/item_order.entity';
import { ItemOrderService } from '@module/item_order/item_order.service';
import {
  BodyPayment,
  ResponseCreateOrder,
  ResponseExport,
  ResponseGetOrder,
  ResponsePayment
} from './order.dto';
import { BodyCreateOrder } from './order.dto';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { SaleService } from '@module/sale/sale.service';
import { SaleItemService } from '@module/sale_item/sale_item.service';
import { UserService } from '@module/user/user.service';
import { WarehouseService } from '@module/warehouse/warehouse.service';
import { WarehouseLog } from '@module/warehouse_log/warehouse_log.entity';
import { WarehouseLogService } from '@module/warehouse_log/warehouse_log.service';
import { getConnection } from 'typeorm';
import { Item } from '@module/item/item.entity';
const moment = require('moment');

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly itemOrderService: ItemOrderService,
    private readonly warehouseService: WarehouseService,
    private readonly warehouseLogService: WarehouseLogService,
    private readonly invoiceService: InvoiceService,
    private readonly userService: UserService,
    private readonly itemService: ItemService,
    private readonly saleService: SaleService,
    private readonly saleItemService: SaleItemService
  ) {}

  @ApiOkResponse({ description: 'Get all orders' })
  @Get()
  async getAll(@Res() res): Promise<ResponseGetOrder> {
    try {
      let categories: Order[] = await this.orderService.getAll();
      if (!categories || categories.length === 0) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
        errors: 0,
        data: categories
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    }
  }

  @ApiOkResponse({ description: "Get a order by order's id" })
  @Get(':id')
  async getById(
    @Res() res,
    @Param('id') id: number
  ): Promise<ResponseGetOrder> {
    try {
      let order: Order = await this.orderService.getById(id);

      if (!order) {
        return res.status(HttpStatus.OK).json({
          error: 0,
          data: 0
        });
      }
      return res.status(HttpStatus.OK).json({
        errors: 0,
        data: order
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    }
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
    @Res() res
  ): Promise<ResponseCreateOrder> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    // Start transaction
    await queryRunner.startTransaction();
    try {
      let newOrder = new Order();
      newOrder.payment_method = body.payment_method;
      newOrder.delivery_address = body.delivery_address;
      newOrder.created_by = res.locals.jwtPayload.userId; // Get from token
      const order = await this.orderService.create(newOrder);

      const _item = body.item;
      const _amount = body.amount;
      for (const i in _item) {
        if (Object.prototype.hasOwnProperty.call(_item, i)) {
          let newItemOrder = new ItemOrder();
          newItemOrder.item = <any>_item[i];
          newItemOrder.amount = <any>_amount[i];
          newItemOrder.order = <any>order.id;
          await this.itemOrderService.create(newItemOrder);
        }
      }
      // commit transaction
      await queryRunner.commitTransaction();
      return res.status(201).json({
        error: 0,
        data: order
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    } finally {
      await queryRunner.release();
    }
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
    @Param('id') id: number
  ): Promise<ResponseExport> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    // Start transaction
    await queryRunner.startTransaction();
    try {
      const _order: Order = await this.orderService.getById(id);

      if (!_order) {
        return res.status(404).json({
          error: 1,
          message: 'Order is not found'
        });
      }

      // Check order is exported
      const isExported: boolean = await this.orderService.isExported(_order.id);

      if (isExported) {
        return res.status(409).json({
          error: 1,
          message: 'This order is exported'
        });
      }

      // Check order is paid
      const isPaid: boolean = await this.orderService.isPaid(_order.id);

      if (isPaid) {
        return res.status(409).json({
          error: 1,
          message: 'This order is paid'
        });
      }

      // Check quantity to export
      const subtractOneMonth = moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD');

      const _itemOrder = await this.itemOrderService.getByOrderId(_order.id);

      let _itemData = [];
      let _amountData = [];

      for (let i in _itemOrder) {
        if (Object.prototype.hasOwnProperty.call(_itemOrder, i)) {
          let { amount } = _itemOrder[i];
          let { id } = _itemOrder[i].item;
          let enoughToExport = await this.warehouseService.isEnoughItemToExport(
            subtractOneMonth,
            id,
            amount
          );

          if (!enoughToExport) {
            return res.status(400).json({
              error: 0,
              message: 'Item quantity is not enough'
            });
          }
          _itemData.push(id);
          _amountData.push(amount);
        }
      }

      // Exporting
      let responseExport = await this.warehouseService.exportItemByAmount(
        subtractOneMonth,
        _itemData,
        _amountData
      );

      // // Create warehouse log
      // for (let index = 0; index < responseExport.length; index++) {
      //   let responseExport_i = responseExport[index].toString().split(';');
      //   let newWarehouseLog = new WarehouseLog();
      //   newWarehouseLog.status = '-';
      //   newWarehouseLog.warehouse = <any>responseExport_i[0];
      //   newWarehouseLog.item_id = <any>responseExport_i[1];
      //   newWarehouseLog.amount = <any>responseExport_i[2];
      //   newWarehouseLog.expiration_date = <any>responseExport_i[3];
      //   newWarehouseLog.created_by = res.locals.jwtPayload.userId; // Get from token
      //   await this.warehouseLogService.create(newWarehouseLog);
      // }

      // Sum total order amount
      let sumAmount = 30000;
      for (let i in _itemData) {
        if (Object.prototype.hasOwnProperty.call(_itemData, i)) {
          let _item: Item = await this.itemService.findOneAndSelectPrice(
            _itemData[i]
          );
          sumAmount += _item.price * _amountData[i];
        }
      }

      // Check sale
      if (!!body.sale_code) {
        let _sale = await this.saleService.getSaleStillApply(body.sale_code);
        if (_sale) {
          for (let i in _itemData) {
            if (Object.prototype.hasOwnProperty.call(_itemData, i)) {
              // Check item exist in this sale
              let _saleItem =
                await this.saleItemService.findItemAndAmountBySaleId(
                  _sale.id,
                  _itemData[i],
                  _amountData[i]
                );
              if (_saleItem) {
                await this.saleItemService.updateAmount(
                  _saleItem.id,
                  _amountData[i]
                );
                let _item = await this.itemService.getById(_itemData[i]);
                sumAmount -=
                  (_item.price / 100) * _sale.discount * _amountData[i];
              }
            }
          }
        }
      }

      if ([1, 2, 3].includes(res.locals.jwtPayload.roleId)) {
        sumAmount -= (sumAmount / 100) * 20;
      }

      // Create invoice
      const _user = await this.userService.getById(
        res.locals.jwtPayload.userId
      );
      let newInvoice = new Invoice();
      newInvoice.name = _user.name;
      newInvoice.phone = _user.phone;
      newInvoice.amount = sumAmount <= 0 ? 0 : sumAmount;
      newInvoice.shipping = 30000;
      newInvoice.created_by = res.locals.jwtPayload.userId;
      newInvoice.order = <any>_order.id;
      await this.invoiceService.create(newInvoice);

      // Update exported into order
      await this.orderService.exportOrder(_order.id);

      // commit transaction
      await queryRunner.commitTransaction();
      return res.status(HttpStatus.OK).json({
        error: 0,
        message: 'Exporting successful'
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return res.status(500).json({
        error: 1,
        message: 'Server occurred an error'
      });
    } finally {
      await queryRunner.release();
    }
  }

  @ApiOkResponse({ description: 'Pay a order' })
  @Delete(':id')
  async delete(@Res() res, @Param('id') id: number): Promise<ResponsePayment> {
    // Update paid into order
    await this.orderService.payOrder(id);
    return res.status(HttpStatus.OK).json({
      error: 0,
      message: 'This order is paid'
    });
  }
}