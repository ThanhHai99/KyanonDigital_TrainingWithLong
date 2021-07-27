import { Controller, Get, Response } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiOkResponse,
    ApiSecurity,
    ApiTags,
    getSchemaPath
} from '@nestjs/swagger';
import { Role } from '../entities/roles.entity';
import { RolesService } from '../services/roles.service';

@ApiTags('roles')
@ApiBasicAuth()
@ApiSecurity('basic')
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(Role) }]
        }
    })
    @Get()
    async read(@Response() res) {
        try {
            const roles: Role[] = await this.rolesService.readAll();
            if (!roles) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: roles
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}