import { Controller, Get, Response } from '@nestjs/common';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @Get()
    async findAll(@Response() res) {
        try {
            const roles: Role[] = await this.rolesService.findAll();
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
