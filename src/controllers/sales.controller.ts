import { Controller, Query, Get, Response, Param } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { Sale } from 'src/entities/sales.entity';
import { SaleService } from '../services/sales.service';

@ApiTags('sales')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('sales')
export class SaleController {
    constructor(private saleService: SaleService) {}

    @ApiOkResponse({ description: 'Get all sales' })
    @Get()
    async readAll(@Response() res) {
        try {
            let sales: Sale[] = await this.saleService.readAll();
            if (!sales) {
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
    async readById(@Response() res, @Param('id') id: number) {
        try {
            let sale: Sale = await this.saleService.readById(id);

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
}
