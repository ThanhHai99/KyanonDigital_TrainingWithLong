import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOkResponse({ description: 'Get all roles' })
  @Get()
  async getAll(@Res() res) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.roleService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get role by id' })
  @Get(':id')
  async getById(@Res() res, @Param('id') id: number) {
    return res.status(HttpStatus.OK).json({
      errors: 0,
      data: await this.roleService.getById(id)
    });
  }
}
