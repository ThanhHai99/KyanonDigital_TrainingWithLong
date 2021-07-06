import { Controller, Get, Post, Param, Body, Delete, Query, Response } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {};

    @Get()
    async findAll(@Response() res) {
        try {
            const users = await this.usersService.getAll();
            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).send("Server occurred an error");
        };
    };

    @Get(":id")
    async findOne(@Param("id") id, @Response() res) {
        try {
            const user = await this.usersService.getById(id);
            return res.status(200).send(user);
        } catch (error) {
            return res.status(500).send("Server occurred an error");
        };
    };

    @Post()
    async add(@Body() createUserDto: CreateUserDto, @Response() res) {
        let user = new User();
        user.username = createUserDto.username;
        user.password = createUserDto.password;
        user.name = createUserDto.name;
        
        try {
            const users = await this.usersService.create(user);
            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).send("Server occurred an error");
        };
    };

    @Delete()
    async delete(@Query() query, @Response() res) {
        try {
            console.log(query.id);
            const users = await this.usersService.delete(query.id);
            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).send("Server occurred an error");
        };
    };
};
