import {
    Controller,
    Get,
    Response,
    Param,
    Post,
    Body,
    Patch
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
import { BodyPayment, ResponseCreateOrder, ResponseGetOrder, ResponsePayment } from 'src/modules/order/dto/order.dto';
import { BodyCreateOrder } from 'src/modules/order/dto/order.dto';
import { Order } from 'src/modules/order/entity/orders.entity';
import { OrderService } from 'src/modules/order/service/orders.service';

@ApiTags('orders')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
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
    // newOrder.name = body.name;
        newOrder.user = res.locals.jwtPayload.userId; // Get from token

        try {
            const category = await this.orderService.create(newOrder);

            return res.status(201).json({
                error: 0,
                data: category
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: 'Pay a order' })
    @ApiBody({ type: BodyPayment })
    @Patch(':id')
    async update(
        @Body() body: BodyPayment,
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponsePayment> {
        let _order: Order = await this.orderService.getById(id);

        if (!_order) {
            return res.status(404).json({
                error: 1,
                message: 'Order is not found'
            });
        }

        // _order.name = !!body.name ? body.name : _order.name;
        _order.user = res.locals.jwtPayload.userId; // Get from token

        const isPaid: boolean = await this.orderService.isPaid(
            _order.id
        );

        if (isPaid) {
            return res.status(409).json({
                error: 1,
                message: 'This order is paid'
            });
        }

        try {
            const category: Order = await this.orderService.update(
                _order
            );
            // Exporting

            // Create invoice
            
            return res.status(200).json({
                error: 0,
                data: category
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
