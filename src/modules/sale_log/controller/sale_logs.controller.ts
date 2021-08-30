import { Controller, Get, Response, Param } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { SaleLog } from 'src/modules/sale_log/entity/sale_logs.entity';
import { SaleLogService } from 'src/modules/sale_log/service/sale_logs.service';

@ApiTags('sale_logs')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('sale_logs')
export class SaleLogController {
    constructor(private saleLogService: SaleLogService) {}

    @ApiOkResponse({ description: 'Get all sale log' })
    @Get()
    async readAll(@Response() res) {
        try {
            let saleLog: SaleLog[] =
                await this.saleLogService.getAll();
            if (!saleLog || saleLog.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: saleLog
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: 'Get a sale log by id' })
    @Get(':id')
    async readById(@Response() res, @Param('id') id: number) {
        try {
            let saleLog: SaleLog =
                await this.saleLogService.getById(id);

            if (!saleLog) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: saleLog
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
