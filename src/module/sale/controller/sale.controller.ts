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
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { getConnection } from 'typeorm';
import { SaleItem } from '../../sale_item/entity/sale_items.entity';
import { SaleItemService } from '../../sale_item/service/sale_item.service';
import { SaleLog } from '../../sale_log/entity/sale_log.entity';
import { SaleLogService } from '../../sale_log/service/sale_log.service';
import {
    BodyCreateSale,
    BodyUpdateSale,
    ResponseCreateSale,
    ResponseGetSale,
    ResponseUpdateSale
} from '../dto/sale.dto';
import { Sale } from '../entity/sale.entity';
import { SaleService } from '../service/sale.service';

@ApiTags('sale')
@ApiSecurity('JwtAuthGuard')
@Controller('sale')
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
    async readById(
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseGetSale> {
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

    @ApiCreatedResponse({
        type: BodyCreateSale,
        description: 'The record has been successfully created.'
    })
    @ApiBody({ type: BodyCreateSale })
    @Post()
    async create(
        @Body() body: BodyCreateSale,
        @Response() res
    ): Promise<ResponseCreateSale> {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        // Start transaction
        await queryRunner.startTransaction();

        try {
            let newSale = new Sale();
            newSale.name = body.name;
            newSale.start_date = body.start_date;
            newSale.end_date = body.end_date;
            newSale.discount = body.discount;
            newSale.applied = !!body.applied ? body.applied : false;
            newSale.code = body.code;
            newSale.user = res.locals.jwtPayload.userId; // Get from token

            const isNameExisting: boolean =
                await this.saleService.isNameAlreadyInUse(newSale.name);

            if (isNameExisting) {
                return res.status(409).json({
                    error: 1,
                    data: 'Name already exists'
                });
            }

            const sale: Sale = await this.saleService.create(newSale);
            // Create sale item
            const itemArray: Array<number> = body.item_id;
            const amountArray: Array<number> = body.amount;

            for (const i in itemArray) {
                if (Object.prototype.hasOwnProperty.call(itemArray, i)) {
                    let newSaleItem = new SaleItem();
                    newSaleItem.item_id = itemArray[i];
                    newSaleItem.sale = <any>sale.id;
                    newSaleItem.amount = amountArray[i];
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
            newSaleLog.amount = body.amount.toString();
            newSaleLog.discount = sale.discount;
            newSaleLog.applied = sale.applied;
            newSaleLog.code = sale.code;
            newSaleLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.saleLogService.create(newSaleLog);

            // commit transaction
            await queryRunner.commitTransaction();
            return res.status(201).json({
                error: 0,
                data: sale
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
        type: BodyUpdateSale,
        description: 'The record has been successfully updated.'
    })
    @ApiBody({ type: BodyUpdateSale })
    @Patch(':id')
    async update(
        @Body() body: BodyUpdateSale,
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseUpdateSale> {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        // Start transaction
        await queryRunner.startTransaction();
        try {
            const _sale: Sale = await this.saleService.getById(id);
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

            const isNameExisting: boolean =
                await this.saleService.isNameAlreadyInUse(body.name);

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
            _sale.discount = !!body.discount ? body.discount : _sale.discount;
            _sale.applied = !!body.applied ? body.applied : _sale.applied;
            _sale.user = res.locals.jwtPayload.userId; // Get from token

            const sale: Sale = await this.saleService.update(_sale);
            const t: SaleItem[] = await this.saleItemService.getBySaleId(
                _sale.id
            );
            const sale_item: string = t.map((e) => e.item_id).toString();

            // Create sale log
            let newSaleLog: SaleLog = new SaleLog();
            newSaleLog.name = sale.name;
            newSaleLog.sale = <any>sale.id;
            newSaleLog.sale_item = sale_item;
            newSaleLog.start_date = sale.start_date;
            newSaleLog.end_date = sale.end_date;
            // newSaleLog.amount = sale.amount;
            newSaleLog.discount = sale.discount;
            newSaleLog.applied = sale.applied;
            newSaleLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.saleLogService.create(newSaleLog);

            // commit transaction
            await queryRunner.commitTransaction();
            return res.status(200).json({
                error: 0,
                data: sale
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
}
