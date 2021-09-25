import { Controller, Get, Param, Response } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOkResponse({ description: 'Get all role' })
  @Get()
  async getAll(@Response() res) {
    return res.status(200).json({
      errors: 0,
      data: await this.roleService.getAll()
    });
  }

  @ApiOkResponse({ description: 'Get role by id' })
  @Get(':id')
  async getById(@Response() res, @Param('id') id: number) {
    return res.status(200).json({
      errors: 0,
      data: await this.roleService.getById(id)
    });
  }
}
