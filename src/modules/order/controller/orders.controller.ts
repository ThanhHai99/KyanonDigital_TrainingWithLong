import {
    Controller,
    Get,
    Response,
    Param,
    Post,
    Body,
    Patch,
    Query,
    Delete
} from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { Invoice } from 'src/modules/invoice/entity/invoices.entity';
import { InvoiceService } from 'src/modules/invoice/service/invoices.service';
import { ItemService } from 'src/modules/item/service/items.service';
import { ItemOrder } from 'src/modules/item_order/entity/item_order.entity';
import { ItemOrderService } from 'src/modules/item_order/service/item_order.service';
import {
    BodyPayment,
    ResponseCreateOrder,
    ResponseExport,
    ResponseGetOrder,
    ResponsePayment
} from 'src/modules/order/dto/order.dto';
import { BodyCreateOrder } from 'src/modules/order/dto/order.dto';
import { Order } from 'src/modules/order/entity/orders.entity';
import { OrderService } from 'src/modules/order/service/orders.service';
import { SaleService } from 'src/modules/sale/service/sales.service';
import { SaleItemService } from 'src/modules/sale_item/service/sale_items.service';
import { UsersService } from 'src/modules/user/service/users.service';
import { WarehouseService } from 'src/modules/warehouse/service/warehouses.service';
import { WarehouseLog } from 'src/modules/warehouse_log/entity/warehouse_logs.entity';
import { WarehouseLogService } from 'src/modules/warehouse_log/service/warehouse_logs.service';
const moment = require('moment');

@ApiTags('orders')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly itemOrderService: ItemOrderService,
        private readonly warehouseService: WarehouseService,
        private readonly warehouseLogService: WarehouseLogService,
        private readonly invoiceService: InvoiceService,
        private readonly userService: UsersService,
        private readonly itemService: ItemService,
        private readonly saleService: SaleService,
        private readonly saleItemService: SaleItemService
    ) {}

    @ApiOkResponse({ description: 'Get all orders' })
    @Get()
    async readAll(@Response() res): Promise<ResponseGetOrder> {
        try {
            let categories: Order[] = await this.orderService.getAll();
            if (!categories || categories.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
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
    async readById(
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseGetOrder> {
        try {
            let order: Order = await this.orderService.getById(id);

            if (!order) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
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

    @ApiOkResponse({ description: 'Create a order' })
    @ApiBody({ type: BodyCreateOrder })
    @Post()
    @ApiResponse({ status: 400, description: 'Not allowed to create' })
    @ApiResponse({ status: 500, description: 'Server occurred an error' })
    @ApiCreatedResponse({
        description: '',
        type: Order
    })
    async create(
        @Body() body: BodyCreateOrder,
        @Response() res
    ): Promise<ResponseCreateOrder> {
        let newOrder = new Order();
        newOrder.payment_method = body.payment_method;
        newOrder.delivery_address = body.delivery_address;
        newOrder.created_by = res.locals.jwtPayload.userId; // Get from token
        try {
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
            return res.status(201).json({
                error: 0,
                data: order
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: 'Exporting a order' })
    @ApiBody({ type: BodyPayment })
    @Patch(':id')
    async update(
        @Body() body: BodyPayment,
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseExport> {
        const _order: Order = await this.orderService.getById(id);

        if (!_order) {
            return res.status(404).json({
                error: 1,
                message: 'Order is not found'
            });
        }

        // Check order is exported
        const isExported: boolean = await this.orderService.isExported(
            _order.id
        );

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

        try {
            // Check quantity to export
            const subtractOneMonth = moment()
                .subtract(1, 'months')
                .format('YYYY-MM-DD');

            const _itemOrder = await this.itemOrderService.getByOrderId(
                _order.id
            );

            let _itemData = [];
            let _amountData = [];

            for (let i in _itemOrder) {
                if (Object.prototype.hasOwnProperty.call(_itemOrder, i)) {
                    let { amount } = _itemOrder[i];
                    let { id } = _itemOrder[i].item;
                    let enoughToExport =
                        await this.warehouseService.isEnoughItemToExport(
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

            // Create warehouse log
            for (let index = 0; index < responseExport.length; index++) {
                let responseExport_i = responseExport[index]
                    .toString()
                    .split(';');
                let newWarehouseLog = new WarehouseLog();
                newWarehouseLog.status = '-';
                newWarehouseLog.warehouse = <any>responseExport_i[0];
                newWarehouseLog.item_id = <any>responseExport_i[1];
                newWarehouseLog.amount = <any>responseExport_i[2];
                newWarehouseLog.expiration_date = <any>responseExport_i[3];
                newWarehouseLog.created_by = res.locals.jwtPayload.userId; // Get from token
                await this.warehouseLogService.create(newWarehouseLog);
            }

            // Sum total order amount
            let sumAmount = 0;
            for (let i in _itemData) {
                if (Object.prototype.hasOwnProperty.call(_itemData, i)) {
                    let _item = await this.itemService.getById(_itemData[i]);
                    sumAmount += _item.price * _amountData[i];
                }
            }

            // Check sale
            if (!!body.sale_code) {
                let _sale = await this.saleService.getSaleStillApply(
                    body.sale_code
                );
                if (_sale) {
                    for (let i in _itemData) {
                        if (
                            Object.prototype.hasOwnProperty.call(_itemData, i)
                        ) {
                            let _saleItem =
                                await this.saleItemService.findItemBySaleId(
                                    _sale.id,
                                    _itemData[i]
                                );
                            if (_saleItem) {
                                let _item = await this.itemService.getById(
                                    _itemData[i]
                                );
                                sumAmount -=
                                    (_item.price / 100) *
                                    _sale.discount *
                                    _amountData[i];
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
            newInvoice.amount = sumAmount;
            newInvoice.created_by = res.locals.jwtPayload.userId;
            newInvoice.order = <any>_order.id;
            await this.invoiceService.create(newInvoice);

            // Update exported into order
            await this.orderService.exportOrder(_order.id);

            return res.status(200).json({
                error: 0,
                message: 'Exporting successful'
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: 'Pay a order' })
    @Delete(':id')
    async delete(
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponsePayment> {
        // Update paid into order
        await this.orderService.payOrder(id);
        return res.status(200).json({
            error: 0,
            message: 'This order is paid'
        });
    }
}
