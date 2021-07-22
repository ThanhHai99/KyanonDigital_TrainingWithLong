import { Controller, Get, Param, Response } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async findAll(@Response() res) {
        try {
            const users = await this.usersService.getAll();
            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).send('Server occurred an error');
        }
    }

    @Get(':id')
    async findOne(@Param('id') id, @Response() res) {
        try {
            const user = await this.usersService.getById(id);
            return res.status(200).send(user);
        } catch (error) {
            return res.status(500).send('Server occurred an error');
        }
    }
}
