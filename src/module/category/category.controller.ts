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

@ApiTags('category')
@Controller('category')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOkResponse({ description: 'Get all categories' })
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    const { name } = query;
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.categoryService.getAll(name)
    });
  }

  @ApiOkResponse({ description: 'Get a category by id' })
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
  async create(
    @Body() body: BodyCreateCategory,
    @Res() res,
    @Req() req
  ): Promise<any> {
    const { name } = body;
    await this.categoryService.create(name, req.user.id);
    return res.status(201).json({
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
  @Patch(':id')
  async update(
    @Body() body: BodyUpdateCategory,
    @Res() res,
    @Req() req,
    @Param('id') id: number
  ): Promise<any> {
    const { name } = body;
    await this.categoryService.update(id, name, req.user.id);
    return res.status(HttpStatus.OK).json({
      error: 0,
      data: 'Category is updated'
    });
  }
}
