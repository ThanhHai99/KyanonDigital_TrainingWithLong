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
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import {
    ApiBasicAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import {
    BodyCreateUser,
    ResponseCreateUser,
    ResponseGetUser,
    ResponseLockUser,
    ResponseUpdateUser,
    UpdateUserDto
} from '../dto/user.dto';

@ApiTags('user')
@ApiBasicAuth()
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOkResponse({ description: 'Get user(s)' })
    @Get()
    async read(@Response() res, @Query() query): Promise<ResponseGetUser> {
        try {
            const { name, phone } = query;
            let user: any;

            if (!!phone && !!name) {
                user = await this.userService.getByNameAndPhone(name, phone);
            } else if (!!phone) {
                user = await this.userService.getByPhone(phone);
            } else if (!!name) {
                user = await this.userService.getByName(name);
            } else {
                user = await this.userService.getAll();
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
    async readById(
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseGetUser> {
        try {
            let user: User = await this.userService.getById(id);

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

    @ApiBody({ type: BodyCreateUser })
    @Post()
    @ApiResponse({ status: 400, description: 'Not allowed to create' })
    @ApiResponse({ status: 500, description: 'Server occurred an error' })
    @ApiCreatedResponse({
        description: '0',
        type: User
    })
    async create(
        @Body() body: BodyCreateUser,
        @Response() res
    ): Promise<ResponseCreateUser> {
        let newUser = new User();
        newUser.username = body.username;
        newUser.password = body.password;
        newUser.name = body.name;
        newUser.phone = body.phone;
        newUser.address = body.address;
        newUser.role = <any>body.role;

        if (body.role === 4) {
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

        const isUsernameExisting =
            await this.userService.isUsernameAlreadyInUse(newUser.username);

        if (isUsernameExisting) {
            return res.status(409).json({
                error: 1,
                data: 'Username already exists'
            });
        }

        try {
            const user = await this.userService.create(newUser);
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

    @Patch(':id')
    async update(
        @Body() body: UpdateUserDto,
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseUpdateUser> {
        let _user: User = await this.userService._findOne(id);
        if (!_user) {
            return res.status(404).json({
                error: 1,
                message: 'User is not found'
            });
        }
        _user.name = !!body.name ? body.name : _user.name;
        _user.phone = !!body.phone ? body.phone : _user.phone;
        _user.address = !!body.address ? body.address : _user.address;

        try {
            const user: User = await this.userService.update(_user);
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
    async lock(@Query() query, @Response() res): Promise<ResponseLockUser> {
        try {
            const { id } = query;
            const isSuperAdmin: any = await this.userService.isSuperAdmin(id);

            if (isSuperAdmin === false)
                return res.status(404).json({
                    error: 1,
                    message: 'Account is not found'
                });

            if (isSuperAdmin === null || isSuperAdmin.id !== 0) {
                await this.userService.lock(id);
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
