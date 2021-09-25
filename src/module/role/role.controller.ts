import { Controller, Get, Param, Response } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@ApiTags('role')
@Controller('role')
export class RoleController {
    constructor(private roleService: RoleService) {}

    @ApiOkResponse({ description: 'Get role(s)' })
    @Get()
    async read(@Response() res) {
        try {
            const roles: Role[] = await this.roleService.getAll();

            if (!roles || roles.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            } else {
                return res.status(200).json({
                    errors: 0,
                    data: roles
                });
            }
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: "Get role by role's id" })
    @Get(':id')
    async getById(@Response() res, @Param('id') id: number) {
        try {
            const role: Role = await this.roleService.getById(id);

            if (!role) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            } else {
                return res.status(200).json({
                    errors: 0,
                    data: role
                });
            }
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
