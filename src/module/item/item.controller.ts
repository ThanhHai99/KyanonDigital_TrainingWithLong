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
import { Roles } from 'decorator/role/role.decorator';
import { EnumRole as Role } from '@constant/role/role.constant';
import { RolesGuard } from '@module/role/guards/role.guard';
import { getConnection } from 'typeorm';

@ApiTags('item')
@Controller('item')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiOkResponse({ description: 'Get all items' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.itemService.getAll(query.name)
    });
  }

  @ApiOkResponse({ description: 'Get a item by id' })
  @Roles(Role.super_admin)
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
  @Roles(Role.super_admin)
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
    await getConnection().transaction(async (transactionManager) => {
      const { name, category_id, detail, user_manual, price } = body;
      await this.itemService.create(
        transactionManager,
        name,
        category_id,
        detail,
        user_manual,
        price,
        req.user.id
      );
    });

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
  @Roles(Role.super_admin)
  @Patch(':id')
  async update(
    @Body() body: BodyUpdateItem,
    @Res() res,
    @Req() req,
    @Param('id') id: number
  ): Promise<any> {
    await getConnection().transaction(async (transactionManager) => {
      const { name, category_id, detail, user_manual, price } = body;
      await this.itemService.update(
        transactionManager,
        id,
        name,
        category_id,
        detail,
        user_manual,
        price,
        req.user.id
      );
    });
    return res.status(HttpStatus.OK).json({
      error: 0,
      data: 'Item is updated'
    });
  }
}
