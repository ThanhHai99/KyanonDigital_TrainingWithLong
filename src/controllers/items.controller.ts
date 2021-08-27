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
    ApiBasicAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { ItemService } from 'src/services/items.service';
import { Item } from 'src/entities/items.entity';
import { ItemDto } from 'src/dto/item.dto';
import { ItemLogService } from 'src/services/item_logs.service';
import { PriceLogService } from 'src/services/price_logs.service';
import { ItemLog } from 'src/entities/item_logs.entity';
import { PriceLog } from 'src/entities/price_logs.entity';

@ApiTags('items')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('items')
export class ItemController {
    constructor(
        private readonly itemService: ItemService,
        private readonly itemLogService: ItemLogService,
        private readonly priceLogService: PriceLogService
    ) {}

    @ApiOkResponse({ description: 'Get all items' })
    @Get()
    async readAll(@Response() res) {
        try {
            let items: Item[] = await this.itemService.getAll();
            if (!items || items.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: items
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
    async readById(@Response() res, @Param('id') id: number) {
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

    @ApiBody({ type: ItemDto })
    @Post()
    @ApiResponse({ status: 400, description: 'Not allowed to create' })
    @ApiResponse({ status: 500, description: 'Server occurred an error' })
    @ApiCreatedResponse({
        description: '0',
        type: Item
    })
    async create(@Body() itemDto: ItemDto, @Response() res): Promise<any> {
        let newItem: Item = new Item();
        newItem.name = itemDto.name;
        newItem.category = <any>itemDto.category_id;
        newItem.detail = itemDto.detail;
        newItem.user_manual = itemDto.user_manual;
        newItem.price = itemDto.price;
        newItem.user = res.locals.jwtPayload.userId; // Get from token

        const isNameExisting = await this.itemService.isNameAlreadyInUse(
            newItem.name
        );

        if (isNameExisting) {
            return res.status(409).json({
                error: 1,
                data: 'Name already exists'
            });
        }

        try {
            const item = await this.itemService.create(newItem);
            // Create item log
            let newItemLog: ItemLog = new ItemLog();
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

    @Patch(':id')
    async update(
        @Body() itemDto: ItemDto,
        @Response() res,
        @Param('id') id: number
    ): Promise<any> {
        let _item: Item = await this.itemService._findOne(id);
        _item.name = !!itemDto.name ? itemDto.name : _item.name;
        _item.detail = !!itemDto.detail ? itemDto.detail : _item.detail;
        _item.user_manual = !!itemDto.user_manual
            ? itemDto.user_manual
            : _item.user_manual;
        _item.price = !!itemDto.price ? itemDto.price : _item.price;
        
        const isNameExisting = await this.itemService.isNameAlreadyInUse(
            _item.name
        );

        if (isNameExisting) {
            return res.status(409).json({
                error: 1,
                data: 'Name already exists'
            });
        }

        try {
            const item: Item = await this.itemService.update(_item);

            // Create item log
            let newItemLog: ItemLog = new ItemLog();
            newItemLog.item_id = _item.id;
            newItemLog.name = _item.name;
            newItemLog.category_id = <any>_item.category;
            newItemLog.detail = _item.detail;
            newItemLog.user_manual = _item.user_manual;
            newItemLog.created_by = res.locals.jwtPayload.userId; // Get from token
            await this.itemLogService.create(newItemLog);

            // Create price log
            if (!!itemDto.price) {
                let newPriceLog: PriceLog = new PriceLog();
                newPriceLog.item_id = _item.id;
                newPriceLog.price = _item.price;
                newPriceLog.created_by = res.locals.jwtPayload.userId; // Get from token
                await this.priceLogService.create(newPriceLog);
            }

            return res.status(200).json({
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
}
