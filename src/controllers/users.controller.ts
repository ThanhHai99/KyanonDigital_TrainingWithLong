import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    Response
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create_user.dto';
import { User } from '../entities/users.entity';
import { UsersService } from '../services/users.service';
import { validate } from 'class-validator';
import {
    ApiBasicAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiResponse,
    ApiSecurity,
    ApiTags,
    getSchemaPath
} from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dto/update_user.dto';
const moment = require('moment');

@ApiTags('users')
@ApiBasicAuth()
// @ApiSecurity('basic')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @ApiOkResponse({ description: 'List users' })
    async read(@Response() res, @Query() query): Promise<any> {
        try {
            const { phone, name } = query;
            let user: any;
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

    @ApiBody({ type: CreateUserDto })
    @Post()
    @ApiResponse({ status: 400, description: 'Not allowed to create' })
    @ApiResponse({ status: 500, description: 'Server occurred an error' })
    @ApiCreatedResponse({
        description: '0',
        type: User
    })
    async create(
        @Body() createUserDto: CreateUserDto,
        @Response() res
    ): Promise<any> {
        let newUser: User = new User();
        newUser.username = createUserDto.username;
        newUser.password = createUserDto.password;
        newUser.name = createUserDto.name;
        newUser.phone = createUserDto.phone;
        newUser.address = createUserDto.address;
        newUser.role = <any>createUserDto.role;
        newUser.is_locked = false;
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

    @Patch()
    async update(
        @Body() createUserDto: UpdateUserDto,
        @Response() res
    ): Promise<any> {
        let _user: User = await this.usersService.findOne(createUserDto.id);
        _user.name = createUserDto.name || _user.name;
        _user.phone = createUserDto.phone || _user.phone;
        _user.address = createUserDto.address || _user.address;

        const errors = await validate(_user);
        if (errors.length > 0) {
            return res.status(400).json({
                error: 1,
                data: errors
            });
        }

        try {
            const user: User = await this.usersService.update(_user);
            return res.status(200).json({
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

    @Delete()
    async lock(@Query() query, @Response() res): Promise<any> {
        try {
            const { id } = query;
            const isSuperAdmin: any = await this.usersService.isSuperAdmin(id);
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