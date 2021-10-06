import {
  Controller,
  Get,
  Res,
  Param,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  HttpStatus,
  Query
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { BodyCreateCategory, BodyUpdateCategory } from './category.dto';
import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';
import { RolesGuard } from '@module/role/guards/role.guard';
import { Roles } from 'decorator/role/role.decorator';
import { EnumRole as Role } from '@constant/role/role.constant';
import { Connection, getConnection } from 'typeorm';

@ApiTags('category')
@Controller('category')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CategoryController {
  constructor(
    private readonly connection: Connection,
    private readonly categoryService: CategoryService
  ) {}

  @ApiOkResponse({ description: 'Get all categories' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    const { name } = query;
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.categoryService.getAll(name)
    });
  }

  @ApiOkResponse({ description: 'Get a category by id' })
  @Roles(Role.super_admin)
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number): Promise<any> {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.categoryService.getById(id)
    });
  }

  @ApiCreatedResponse({
    type: BodyCreateCategory,
    description: 'The record has been successfully created.'
  })
  @ApiBody({ type: BodyCreateCategory })
  @Post()
  @Roles(Role.super_admin)
  async create(
    @Body() body: BodyCreateCategory,
    @Res() res,
    @Req() req
  ): Promise<any> {
    await getConnection().transaction(async (transactionManager) => {
      await this.categoryService.create(
        transactionManager,
        body.name,
        req.user.id
      );
    });

    return res.status(HttpStatus.CREATED).json({
      error: 0,
      data: 'Category is created'
    });
  }

  @ApiCreatedResponse({
    type: BodyUpdateCategory,
    description: 'The record has been successfully updated.'
  })
  @ApiOkResponse({ description: 'Update a category' })
  @ApiBody({ type: BodyUpdateCategory })
  @Roles(Role.super_admin)
  @Patch(':id')
  async update(
    @Body() body: BodyUpdateCategory,
    @Res() res,
    @Req() req,
    @Param('id') id: number
  ): Promise<any> {
    await getConnection().transaction(async (transactionManager) => {
      await this.categoryService.update(
        transactionManager,
        id,
        body.name,
        req.user.id
      );
    });
    return res.status(HttpStatus.OK).json({
      error: 0,
      data: 'Category is updated'
    });
  }
}
