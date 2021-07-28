import { Controller, Query, Get, Response } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags,
    getSchemaPath
} from '@nestjs/swagger';
import { Warehouse } from 'src/entities/warehouses.entity';
import { WarehouseService } from '../services/warehouses.service';

@ApiTags('warehouses')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('warehouses')
export class WarehouseController {
    constructor(private warehouseService: WarehouseService) {}

    @ApiOkResponse({
        schema: {
            oneOf: [{ $ref: getSchemaPath(Warehouse) }]
        }
    })
    @Get()
    async read(@Response() res, @Query() query) {
        try {
            const { id } = query;
            let warehouse: any;

            if (id === undefined) {
                warehouse = await this.warehouseService.readAll();
            } else {
                warehouse = await this.warehouseService.readOne(id);
            }

            if (!warehouse) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: warehouse
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
