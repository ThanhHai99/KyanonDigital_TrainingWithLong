import { Controller, Get, Post, Param, Body, Delete, Query } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {};

    @Get()
    async findAll() {
        try {
            const users = await this.usersService.getAll();
            return users;
        } catch (error) {
            return "Error";
        }
    };

    @Get(":id")
    async findOne(@Param("id") id) {
        try {
            const user = await this.usersService.getById(id);
            return user;
        } catch (error) {
            return "Error";
        }
    };

    @Post()
    async add(@Body() createUserDto: CreateUserDto) {
        let user = new User();
        user.username = createUserDto.username;
        user.password = createUserDto.password;
        user.name = createUserDto.name;
        
        try {
            const users = await this.usersService.create(user);
            return users;
        } catch (error) {
            return "Error";
        };
    };

    @Delete()
    async delete(@Query() query) {
        try {
            console.log(query.id);
            const users = await this.usersService.delete(query.id);
            return users;
        } catch (error) {
            return "Error";
        }
    };
}
