import {
    Controller,
    Get,
    Response,
    Param,
    Post,
    Body,
    Patch,
    Query
} from '@nestjs/common';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import {
    BodyCreateItem,
    ResponseGetItem,
    ResponseUpdateItem,
    BodyUpdateItem
} from '../dto/item.dto';
import { Item } from '../entity/item.entity';
import { ItemLog } from '../../item_log/entity/item_log.entity';
import { PriceLog } from '../../price_log/entity/price_log.entity';
import { ItemService } from '../service/item.service';
import { ItemLogService } from '../../item_log/service/item_log.service';
import { PriceLogService } from '../../price_log/service/price_log.service';

@ApiTags('item')
@ApiSecurity('JwtAuthGuard')
@Controller('item')
export class ItemController {
    constructor(
        private readonly itemService: ItemService,
        private readonly itemLogService: ItemLogService,
        private readonly priceLogService: PriceLogService,
    ) {}

    @ApiOkResponse({ description: 'Get all items' })
    @Get()
    async readAll(@Response() res, @Query() query): Promise<ResponseGetItem> {
        try {
            const { name } = query;
            let item: any;

            if (!!name) {
                item = await this.itemService.getByName(name);
            } else {
                item = await this.itemService.getAll();
            }

            if (!item || item.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: item
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: "Get a item by item's id" })
    @Get(':id')
    async readById(
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseGetItem> {
        try {
            let item: Item = await this.itemService.getById(id);

            if (!item) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: item
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiCreatedResponse({
        type: BodyCreateItem,
        description: 'The record has been successfully created.'
    })
    @ApiBody({ type: BodyCreateItem })
    @Post()
    @ApiCreatedResponse({
        description: '0',
        type: Item
    })
    async create(@Body() body: BodyCreateItem, @Response() res): Promise<any> {
        let newItem = new Item();
        newItem.name = body.name;
        newItem.category = <any>body.category_id;
        newItem.detail = body.detail;
        newItem.user_manual = body.user_manual;
        newItem.price = body.price;
        newItem.user = res.locals.jwtPayload.userId; // Get from token

        const isNameExisting: boolean =
            await this.itemService.isNameAlreadyInUse(newItem.name);

        if (isNameExisting) {
            return res.status(409).json({
                error: 1,
                message: 'Name already exists'
            });
        }

        try {
            const item = await this.itemService.create(newItem);
            // Create item log
            let newItemLog = new ItemLog();
            newItemLog.item_id = item.id;
            newItemLog.name = newItem.name;
            newItemLog.category_id = <any>newItem.category;
            newItemLog.detail = newItem.detail;
            newItemLog.user_manual = newItem.user_manual;
            newItemLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.itemLogService.create(newItemLog);

            // Create price log
            let newPriceLog: PriceLog = new PriceLog();
            newPriceLog.item_id = item.id;
            newPriceLog.price = newItem.price;
            newPriceLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.priceLogService.create(newPriceLog);

            return res.status(201).json({
                error: 0,
                data: item
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiCreatedResponse({
        type: BodyUpdateItem,
        description: 'The record has been successfully updated.'
    })
    @ApiBody({ type: BodyUpdateItem })
    @Patch(':id')
    async update(
        @Body() body: BodyUpdateItem,
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseUpdateItem> {
        let _item: Item = await this.itemService._findOne(id);
        _item.name = !!body.name ? body.name : _item.name;
        _item.detail = !!body.detail ? body.detail : _item.detail;
        _item.user_manual = !!body.user_manual
            ? body.user_manual
            : _item.user_manual;
        _item.price = !!body.price ? body.price : _item.price;

        const isNameExisting: boolean =
            await this.itemService.isNameAlreadyInUse(_item.name);

        if (isNameExisting) {
            return res.status(409).json({
                error: 1,
                data: 'Name already exists'
            });
        }

        try {
            const item: Item = await this.itemService.update(_item);

            console.log(item);

            // Create item log
            let newItemLog = new ItemLog();
            newItemLog.item_id = item.id;
            newItemLog.name = item.name;
            newItemLog.category_id = item.category.id;
            newItemLog.detail = item.detail;
            newItemLog.user_manual = item.user_manual;
            newItemLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.itemLogService.create(newItemLog);

            // Create price log
            if (!!body.price) {
                let newPriceLog = new PriceLog();
                newPriceLog.item_id = item.id;
                newPriceLog.price = item.price;
                newPriceLog.created_by = res.locals.jwtPayload.userId; // Get from token
                await this.priceLogService.create(newPriceLog);
            }

            return res.status(200).json({
                error: 0,
                data: item
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
