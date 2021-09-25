import { Controller, Get, Response, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PriceLog } from './price_log.entity';
import { PriceLogService } from './price_log.service';

@ApiTags('price_log')
@Controller('price_log')
export class PriceLogController {
    constructor(private priceLogService: PriceLogService) {}

    @ApiOkResponse({ description: 'Get all prices log' })
    @Get()
    async getAll(@Response() res) {
        try {
            let priceLog: PriceLog[] = await this.priceLogService.getAll();
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
    async getById(@Response() res, @Param('id') id: number) {
        try {
            let priceLog: PriceLog = await this.priceLogService.getById(id);

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
