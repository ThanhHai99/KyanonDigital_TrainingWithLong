import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Response,
    Query,
    Param
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
    ApiTags
} from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dto/update_user.dto';

@ApiTags('users')
@ApiBasicAuth()
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOkResponse({ description: 'Get user(s)' })
    @Get()
    async read(@Response() res, @Query() query) {
        try {
            const { name, phone } = query;
            let user: any;

            if (!!phone && !!name) {
                user = await this.usersService.getByNameAndPhone(name, phone);
            } else if (!!phone) {
                user = await this.usersService.getByPhone(phone);
            } else if (!!name) {
                user = await this.usersService.getByName(name);
            } else {
                user = await this.usersService.getAll();
            }

            if (!user || user.length === 0) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            } else {
                return res.status(200).json({
                    errors: 0,
                    data: user
                });
            }
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }

    @ApiOkResponse({ description: "Get user by user's id" })
    @Get(':id')
    async readById(@Response() res, @Param('id') id: number) {
        try {
            let user: User = await this.usersService.getById(id);

            if (!user) {
                return res.status(200).json({
                    error: 0,
                    data: 0
                });
            } else {
                return res.status(200).json({
                    errors: 0,
                    data: user
                });
            }
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
        // newUser.is_locked = false;

        if (newUser.role === undefined) {
            return res.status(400).json({
                error: 1,
                message: 'Not allowed to create customers'
            });
        }

        if (newUser.role == <any>1) {
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

        const isUsernameExisting =
            await this.usersService.isUsernameAlreadyInUse(newUser.username);

        if (isUsernameExisting) {
            return res.status(409).json({
                error: 1,
                data: 'Username already exists'
            });
        }

        try {
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
        @Body() updateUserDto: UpdateUserDto,
        @Response() res
    ): Promise<any> {
        let _user: User = await this.usersService._findOne(updateUserDto.id);
        _user.name = !!updateUserDto.name ? updateUserDto.name : _user.name;
        _user.phone = !!updateUserDto.phone ? updateUserDto.phone : _user.phone;
        _user.address = !!updateUserDto.address
            ? updateUserDto.address
            : _user.address;
        _user.password = !!updateUserDto.password
            ? updateUserDto.password
            : _user.password;

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
