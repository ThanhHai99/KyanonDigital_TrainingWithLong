import { JwtAuthGuard } from '@module/auth/guard/jwt.guard';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { Roles } from 'decorator/role/role.decorator';
import { EnumRole as Role } from '@constant/role/role.constant';
import { RolesGuard } from './guards/role.guard';

@ApiTags('role')
@Controller('role')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOkResponse({ description: 'Get all roles' })
  @Roles(Role.super_admin)
  @Get()
  async getAll(@Res() res) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.roleService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get role by id' })
  @Roles(Role.super_admin)
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.roleService.getById(id)
    });
  }
}
