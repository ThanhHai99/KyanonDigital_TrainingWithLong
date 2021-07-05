import { Controller, Get, Post, Param, Body, Delete, Query } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {};

    @Get()
    async findAll() {
        const users = await this.usersService.getAll();
        return users;
    };

    @Get(":id")
    async findById(@Param("id") id) {
        const user = await this.usersService.getById(id);
        return user;
    };

    @Post()
    async add(@Body() createUserDto: CreateUserDto) {
        const users = await this.usersService.create(createUserDto);
        return users;
    };

    @Delete()
    async delete(@Query() query) {
        const users = await this.usersService.delete(query.id);
        return users;
    };
}
