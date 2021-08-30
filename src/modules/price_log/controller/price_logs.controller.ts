import { Controller, Get, Response, Param } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { PriceLog } from 'src/modules/price_log/entity/price_logs.entity';
import { PriceLogService } from 'src/modules/price_log/service/price_logs.service';

@ApiTags('price_logs')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('price_logs')
export class PriceLogController {
    constructor(private priceLogService: PriceLogService) {}

    @ApiOkResponse({ description: 'Get all prices log' })
    @Get()
    async readAll(@Response() res) {
        try {
            let priceLog: PriceLog[] =
                await this.priceLogService.getAll();
            if (!priceLog || priceLog.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: priceLog
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: 'Get a price log by id' })
    @Get(':id')
    async readById(@Response() res, @Param('id') id: number) {
        try {
            let priceLog: PriceLog =
                await this.priceLogService.getById(id);

            if (!priceLog) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: priceLog
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
