import {
  Controller,
  Get,
  Res,
  Param,
  Post,
  Body,
  Query,
  HttpStatus,
  UseGuards,
  Req,
  Patch
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { BodyCreateItem, BodyUpdateItem } from './item.dto';
import { Item } from './item.entity';
import { ItemService } from './item.service';
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';

@ApiTags('item')
@Controller('item')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiOkResponse({ description: 'Get all items' })
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    const { name } = query;
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.itemService.getAll(name)
    });
  }

  @ApiOkResponse({ description: 'Get a item by id' })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.itemService.getById(id)
    });
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
  async create(
    @Body() body: BodyCreateItem,
    @Res() res,
    @Req() req
  ): Promise<any> {
    const { name, category_id, detail, user_manual, price } = body;
    await this.itemService.create(
      name,
      category_id,
      detail,
      user_manual,
      price,
      req.user.id
    );

    return res.status(HttpStatus.CREATED).json({
      error: 0,
      data: 'Item is created'
    });
  }

  @ApiCreatedResponse({
    type: BodyUpdateItem,
    description: 'The record has been successfully updated.'
  })
  @ApiBody({ type: BodyUpdateItem })
  @Patch(':id')
  async update(
    @Body() body: BodyUpdateItem,
    @Res() res,
    @Req() req,
    @Param('id') id: number
  ): Promise<any> {
    const { name, category_id, detail, user_manual, price } = body;
    await this.itemService.update(
      id,
      name,
      category_id,
      detail,
      user_manual,
      price,
      req.user.id
    );
    return res.status(HttpStatus.OK).json({
      error: 0,
      data: 'Item is updated'
    });
  }
}
