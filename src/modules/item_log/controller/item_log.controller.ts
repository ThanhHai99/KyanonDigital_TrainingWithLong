import { Controller, Get, Response, Param } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { ResponseGetLog } from 'src/dto/log.dto';
import { ItemLog } from '../entity/item_log.entity';
import { ItemLogService } from '../service/item_log.service';

@ApiTags('item_log')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('item_log')
export class ItemLogController {
    constructor(private itemLogService: ItemLogService) {}

    @ApiOkResponse({ description: 'Get all items log' })
    @Get()
    async readAll(@Response() res): Promise<ResponseGetLog> {
        try {
            let itemLog: ItemLog[] = await this.itemLogService.getAll();
            if (!itemLog || itemLog.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: itemLog
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: 'Get a item log by id' })
    @Get(':id')
    async readById(
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseGetLog> {
        try {
            let itemLog: ItemLog = await this.itemLogService.getById(id);

            if (!itemLog) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: itemLog
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
