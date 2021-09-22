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
import { User } from '@entity/user.entity';
import { UserService } from '@service/user.service';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiSecurity,
    ApiTags
} from '@nestjs/swagger';
import {
    BodyCreateUser,
    ResponseCreateUser,
    ResponseGetUser,
    ResponseLockUser,
    ResponseUpdateUser,
    UpdateUserDto
} from '@dto/user.dto';
import { getConnection } from 'typeorm';

@ApiTags('user')
@ApiSecurity('JwtAuthGuard')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOkResponse({ description: 'Get user(s)' })
    @Get()
    async getAll(@Response() res, @Query() query): Promise<ResponseGetUser> {
        try {
            let user: any = await this.userService.getAll(query);

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
    async getById(
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

    @ApiCreatedResponse({
        type: BodyCreateUser,
        description: 'The record has been successfully created.'
    })
    @ApiBody({ type: BodyCreateUser })
    @Post()
    @ApiCreatedResponse({
        description: '0',
        type: User
    })
    async create(
        @Body() body: BodyCreateUser,
        @Response() res
    ): Promise<ResponseCreateUser> {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        // Start transaction
        await queryRunner.startTransaction();
        try {
            let newUser = new User();
            newUser.username = body.username;
            newUser.password = body.password;
            newUser.name = body.name;
            newUser.phone = body.phone;
            newUser.address = body.address;
            newUser.role = <any>body.role;

            if (body.role === null) {
                return res.status(400).json({
                    error: 1,
                    message: 'Not allowed to create customers'
                });
            }

            if (body.role > 3) {
                return res.status(400).json({
                    error: 1,
                    message: 'Role is invalid.'
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

            const user = await this.userService.create(newUser);

            // commit transaction
            await queryRunner.commitTransaction();
            return res.status(201).json({
                error: 0,
                data: user
            });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        } finally {
            await queryRunner.release();
        }
    }

    @ApiCreatedResponse({
        type: UpdateUserDto,
        description: 'The record has been successfully updated.'
    })
    @ApiBody({ type: UpdateUserDto })
    @Patch(':id')
    async update(
        @Body() body: UpdateUserDto,
        @Response() res,
        @Param('id') id: number
    ): Promise<ResponseUpdateUser> {
        let _user: User = await this.userService.getById(id);
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

    @ApiOkResponse({ description: 'The account is locked.' })
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
