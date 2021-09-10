import { Body, Controller, Get, Param, Post, Response } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { WarehouseLog } from 'src/module/warehouse_log/entity/warehouse_log.entity';
import { WarehouseLogService } from 'src/module/warehouse_log/service/warehouse_log.service';
import {
    BodyImporting,
    ResponseGetWarehouse,
    ResponseImporting
} from '../dto/warehouse.dto';
import { Warehouse } from '../entity/warehouse.entity';
import { WarehouseService } from '../service/warehouse.service';
const moment = require('moment');

@ApiTags('warehouse')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('warehouse')
export class WarehouseController {
    constructor(
        private warehouseService: WarehouseService,
        private warehouseLogService: WarehouseLogService
    ) {}

    @ApiOkResponse({ description: 'Get all item in warehouses' })
    @Get()
    async readAll(@Response() res): Promise<ResponseGetWarehouse> {
        try {
            const warehouses: Warehouse[] =
                await this.warehouseService.getAll();
            if (!warehouses || warehouses.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: warehouses
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    // @ApiOkResponse({ description: "Get a warehouse by warehouse's id" })
    // @Get(':id')
    // async readById(
    //     @Response() res,
    //     @Param('id') id: number
    // ): Promise<ResponseGetWarehouse> {
    //     try {
    //         const warehouse: Warehouse = await this.warehouseService.getById(
    //             id
    //         );
    //         if (!warehouse) {
    //             return res.status(200).json({
    //                 error: 0,
    //                 data: 0
    //             });
    //         }
    //         return res.status(200).json({
    //             errors: 0,
    //             data: warehouse
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             error: 1,
    //             message: 'Server occurred an error'
    //         });
    //     }
    // }

    @ApiOkResponse({ description: '' })
    @Post('importing')
    async importing(
        @Body() body: BodyImporting,
        @Response() res
    ): Promise<ResponseImporting> {
        let newWarehouse = new Warehouse();
        newWarehouse.item = <any>body.item_id;
        newWarehouse.amount = body.amount;
        newWarehouse.expiration_date = body.expiration_date;

        try {
            const warehouse: Warehouse = await this.warehouseService.create(
                newWarehouse
            );
            // Create warehouse log
            let newWarehouseLog = new WarehouseLog();
            newWarehouseLog.status = '+';
            newWarehouseLog.item_id = <any>warehouse.item;
            newWarehouseLog.warehouse = <any>warehouse.id;
            newWarehouseLog.amount = warehouse.amount;
            newWarehouseLog.price = body.price;
            newWarehouseLog.expiration_date = warehouse.expiration_date;
            newWarehouseLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.warehouseLogService.create(newWarehouseLog);

            return res.status(201).json({
                error: 0,
                data: warehouse
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    // @ApiOkResponse({ description: '' })
    // @Post('exporting')
    // async exporting(
    //     @Body() body: BodyExporting,
    //     @Response() res
    // ): Promise<ResponseExporting> {
    //     try {
    //         const subtractOneMonth = moment()
    //             .subtract(1, 'months')
    //             .format('YYYY-MM-DD');
    //         const enoughToExport =
    //             await this.warehouseService.isEnoughItemToExport(
    //                 subtractOneMonth,
    //                 body.item_id,
    //                 body.amount
    //             );

    //         if (!enoughToExport) {
    //             return res.status(400).json({
    //                 error: 0,
    //                 message: 'Item quantity is not enough'
    //             });
    //         }

    //         // Exporting
    //         let responseExport = await this.warehouseService.exportItemByAmount(
    //             subtractOneMonth,
    //             body.item_id,
    //             body.amount
    //         );

    //         // Create warehouse log
    //         for (let index = 0; index < responseExport.length; index++) {
    //             let responseExport_i = responseExport[index]
    //                 .toString()
    //                 .split(';');
    //             let newWarehouseLog = new WarehouseLog();
    //             newWarehouseLog.status = '-';
    //             newWarehouseLog.warehouse = <any>responseExport_i[0];
    //             newWarehouseLog.item_id = <any>responseExport_i[1];
    //             newWarehouseLog.amount = <any>responseExport_i[2];
    //             newWarehouseLog.expiration_date = <any>responseExport_i[3];
    //             newWarehouseLog.created_by = res.locals.jwtPayload.userId; // Get from token

    //             await this.warehouseLogService.create(newWarehouseLog);
    //         }

    //         return res.status(201).json({
    //             error: 0,
    //             message: 'exporting successfully'
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({
    //             error: 1,
    //             message: 'Server occurred an error'
    //         });
    //     }
    // }

    @ApiOkResponse({ description: '' })
    @Get('inventory')
    async inventory(@Response() res): Promise<ResponseGetWarehouse> {
        try {
            const subtractOneMonth = moment()
                .subtract(1, 'months')
                .format('YYYY-MM-DD');
            const warehouses: Warehouse[] =
                await this.warehouseService.getInventory(
                    subtractOneMonth.toString()
                );
            if (!warehouses || warehouses.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                error: 0,
                data: warehouses
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
