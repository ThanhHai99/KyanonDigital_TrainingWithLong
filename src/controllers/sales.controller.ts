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
import {
    BodyCreateSale,
    BodyUpdateSale,
    ResponseCreateSale,
    ResponseGetSale,
    ResponseUpdateSale
} from 'src/dto/sale.dto';
import { Sale } from 'src/entities/sales.entity';
import { SaleItem } from 'src/entities/sale_items.entity';
import { SaleLog } from 'src/entities/sale_logs.entity';
import { SaleItemService } from 'src/services/sale_items.service';
import { SaleLogService } from 'src/services/sale_logs.service';
import { SaleService } from '../services/sales.service';

@ApiTags('sales')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('sales')
export class SaleController {
    constructor(
        private saleService: SaleService,
        private saleLogService: SaleLogService,
        private saleItemService: SaleItemService
    ) {}

    @ApiOkResponse({ description: 'Get all sales' })
    @Get()
    async readAll(@Response() res): Promise<ResponseGetSale> {
        try {
            const sales: Sale[] = await this.saleService.getAll();
            if (!sales || sales.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: sales
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: "Get a sale by sale's id" })
    @Get(':id')
    async readById(@Response() res, @Param('id') id: number): Promise<ResponseGetSale> {
        try {
            const sale: Sale = await this.saleService.getById(id);
            if (!sale) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: sale
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: 'Create a sale' })
    @ApiBody({ type: BodyCreateSale })
    @Post()
    @ApiResponse({ status: 400, description: 'Not allowed to create' })
    @ApiResponse({ status: 500, description: 'Server occurred an error' })
    @ApiCreatedResponse({
        description: '0',
        type: Sale
    })
    async create(
        @Body() body: BodyCreateSale,
        @Response() res
    ): Promise<ResponseCreateSale> {
        let newSale = new Sale();
        newSale.name = body.name;
        newSale.start_date = body.start_date;
        newSale.end_date = body.end_date;
        newSale.amount = body.amount;
        newSale.discount = body.discount;
        newSale.applied = !!body.applied ? body.applied : false;
        newSale.user = res.locals.jwtPayload.userId; // Get from token

        const isNameExisting: boolean = await this.saleService.isNameAlreadyInUse(
            newSale.name
        );

        if (isNameExisting) {
            return res.status(409).json({
                error: 1,
                data: 'Name already exists'
            });
        }

        try {
            const sale: Sale = await this.saleService.create(newSale);
            // Create sale item
            const itemArray: Array<number> = body.item_id;
            for (const i in itemArray) {
                if (Object.prototype.hasOwnProperty.call(itemArray, i)) {
                    const e: number = itemArray[i];
                    let newSaleItem = new SaleItem();
                    newSaleItem.item_id = e;
                    newSaleItem.sale = <any>sale.id;
                    await this.saleItemService.create(newSaleItem);
                }
            }

            // Create sale log
            let newSaleLog = new SaleLog();
            newSaleLog.name = sale.name;
            newSaleLog.sale = <any>sale.id;
            newSaleLog.sale_item = body.item_id.toString();
            newSaleLog.start_date = sale.start_date;
            newSaleLog.end_date = sale.end_date;
            newSaleLog.amount = sale.amount;
            newSaleLog.discount = sale.discount;
            newSaleLog.applied = sale.applied;
            newSaleLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.saleLogService.create(newSaleLog);

            return res.status(201).json({
                error: 0,
                data: sale
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: 'Update a sale' })
    @ApiBody({ type: BodyUpdateSale })
    @Patch(':id')
    async update(
        @Body() body: BodyUpdateSale,
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseUpdateSale> {
        const _sale: Sale = await this.saleService._findOne(id);
        if (!_sale) {
            return res.status(404).json({
                error: 1,
                message: 'Sale is not found'
            });
        }

        if (_sale.applied) {
            return res.status(400).json({
                error: 0,
                message: 'This sale was applied'
            });
        }

        const isNameExisting: boolean = await this.saleService.isNameAlreadyInUse(
            body.name
        );

        if (isNameExisting) {
            return res.status(409).json({
                error: 1,
                message: 'Name already exists'
            });
        }

        _sale.name = !!body.name ? body.name : _sale.name;
        _sale.start_date = !!body.start_date
            ? body.start_date
            : _sale.start_date;
        _sale.end_date = !!body.end_date ? body.end_date : _sale.end_date;
        _sale.amount = !!body.amount ? body.amount : _sale.amount;
        _sale.discount = !!body.discount ? body.discount : _sale.discount;
        _sale.applied = !!body.applied ? body.applied : _sale.applied;
        _sale.user = res.locals.jwtPayload.userId; // Get from token

        try {
            const sale: Sale = await this.saleService.update(_sale);
            const t: SaleItem[] = await this.saleItemService.getBySaleId(_sale.id);
            const sale_item: string = t.map((e) => e.item_id).toString();

            // Create sale log
            let newSaleLog: SaleLog = new SaleLog();
            newSaleLog.name = sale.name;
            newSaleLog.sale = <any>sale.id;
            newSaleLog.sale_item = sale_item;
            newSaleLog.start_date = sale.start_date;
            newSaleLog.end_date = sale.end_date;
            newSaleLog.amount = sale.amount;
            newSaleLog.discount = sale.discount;
            newSaleLog.applied = sale.applied;
            newSaleLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.saleLogService.create(newSaleLog);

            return res.status(200).json({
                error: 0,
                data: sale
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
