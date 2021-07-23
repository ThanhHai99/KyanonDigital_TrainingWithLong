import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Response
} from '@nestjs/common';
import { EntityId } from 'typeorm/repository/EntityId';
import { UserDto } from './user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { validate } from 'class-validator';
const moment = require('moment');

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async read(@Response() res, @Query() query) {
        try {
            let { phone, name } = query;
            let user: User;
            if (phone === undefined && name === undefined) {
                user = await this.usersService.readAll();
            } else {
                user = await this.usersService.readOne(name, phone);
            }

            if (!user) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            }
            return res.status(200).json({
                errors: 0,
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @Post()
    async create(@Body() userDto: UserDto, @Response() res) {
        let newUser = new User();
        newUser.username = userDto.username;
        newUser.password = userDto.password;
        newUser.name = userDto.name;
        newUser.phone = userDto.phone;
        newUser.address = userDto.address;
        newUser.role = <any>userDto.role;
        newUser.created_at = moment().format('YYYY/MM/DD HH:mm');
        newUser.updated_at = moment().format('YYYY/MM/DD HH:mm');

        if (newUser.role === undefined) {
            return res.status(400).json({
                error: 1,
                message: 'Not allowed to create customers'
            });
        }

        if (newUser.role == <any>0) {
            return res.status(400).json({
                error: 1,
                message: 'Not allowed to create another super admin'
            });
        }

        const errors = await validate(newUser);
        if (errors.length > 0) {
            return res.status(400).json({
                error: 1,
                data: errors
            });
        }

        try {
            newUser.hashPassword();
            const user = await this.usersService.create(newUser);
            return res.status(201).json({
                error: 0,
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    // @Patch()
    // async update(@Query() query, @Body() userData: UserDto): Promise<User> {
    //     const { id } = query;
    //     const status = this.usersService.update(id, userData);
    //     return status;
    // }

    @Delete()
    async lock(@Query() query, @Response() res): Promise<any> {
        const { id } = query;
        try {
            const isSuperAdmin = await this.usersService.isSuperAdmin(id);
            if (isSuperAdmin === null || isSuperAdmin.id !== 0) {
                await this.usersService.lock(id);
                return res.status(200).json({
                    error: 0,
                    message: 'Account is locked'
                });
            }
            return res.status(400).json({
                error: 1,
                message: 'Not allowed to lock the super admin account'
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
