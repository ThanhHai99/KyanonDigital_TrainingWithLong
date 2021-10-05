import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';
import {
  Controller,
  Get,
  Res,
  Query,
  Param,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryLogService } from './category_log.service';
import { Roles } from 'decorator/role/role.decorator';
import { EnumRole as Role } from '@constant/role/role.constant';
import { RolesGuard } from '@module/role/guards/role.guard';

@ApiTags('category_log')
@Controller('category_log')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryLogController {
  constructor(private categoryLogService: CategoryLogService) {}

  @ApiOkResponse({ description: 'Get all categories log' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res, @Query() query) {
    const { name } = query;
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.categoryLogService.getAll(name)
    });
  }

  @ApiOkResponse({ description: 'Get a category log by id' })
  @Get(':id')
  @Roles(Role.super_admin)
  async getById(@Res() res, @Param('id') id: number) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.categoryLogService.getById(id)
    });
  }
}
