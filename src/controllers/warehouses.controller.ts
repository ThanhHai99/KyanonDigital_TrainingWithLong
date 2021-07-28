import { Controller, Get, Response } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { Warehouse } from 'src/entities/warehouses.entity';
import { WarehouseService } from '../services/warehouses.service';

@ApiTags('warehouses')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('warehouses')
export class WarehouseController {
    constructor(private warehouseService: WarehouseService) {}

    @ApiOkResponse({ description: 'Get all item in warehouses' })
    @Get()
    async readAll(@Response() res) {
        try {
            let warehouses: Warehouse[] = await this.warehouseService.readAll();

            if (!warehouses) {
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
}
