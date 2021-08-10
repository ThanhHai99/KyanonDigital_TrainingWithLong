import { Controller, Get, Param, Response } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import { Role } from 'src/entities/roles.entity';
import { RolesService } from '../services/roles.service';

@ApiTags('roles')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @ApiOkResponse({ description: 'Get role(s)' })
    @Get()
    async read(@Response() res) {
        try {
            const roles: Role[] = await this.rolesService.getAll();

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
    async readById(@Response() res, @Param('id') id: number) {
        try {
            const role: Role = await this.rolesService.getById(id);

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
