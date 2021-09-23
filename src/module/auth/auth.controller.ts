import { Controller, Post, Body, Response, Get } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
    BodyLogin,
    BodyRegister,
    ResponseLogin,
    ResponseRegister
} from './auth.dto';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiSecurity,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { UserService } from '@module/user/user.service';
import { User } from '@module/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    ) {}

    @ApiOkResponse({ description: 'Login is successful!' })
    @ApiUnauthorizedResponse({ description: 'Incorrect email or password!' })
    @ApiSecurity('auth')
    @Post('login')
    async login(
        @Body() body: BodyLogin,
        @Response() res
    ): Promise<ResponseLogin> {
        const { username, password } = body;

        let user: User = await this.userService.isExisting(username);
        if (!user) {
            return res.status(401).json({
                error: 1,
                message: 'Username or password are invalid'
            });
        }

        const isValidPassword =
            user.checkIfUnencryptedPasswordIsValid(password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 1,
                message: 'Password is invalid'
            });
        }

        if (user.is_locked) {
            return res.status(401).json({
                error: 1,
                message: 'Your account is locked'
            });
        }

        // verify email

        // Get roleId
        const { role } = user;
        // Sing jwt
        let token: any;
        if (role !== null) {
            const { id } = role;
            token = jwt.sign(
                {
                    userId: user.id,
                    username: user.username,
                    roleId: id
                },
                this.configService.get<string>('jwt.secret'),
                {
                    expiresIn: this.configService.get<string>('jwt.expires_in')
                }
            );
        } else {
            token = jwt.sign(
                {
                    userId: user.id,
                    username: user.username,
                    roleId: null
                },
                this.configService.get<string>('jwt.secret'),
                {
                    expiresIn: this.configService.get<string>('jwt.expires_in')
                }
            );
        }

        // Send the jwt in the response
        res.setHeader('auth', token);
        return res.status(200).json({
            error: 0,
            message: 'Sign In successfully'
        });
    }

    @ApiOkResponse({ description: 'Logout is successful!' })
    @Get('logout')
    async logout(@Response() res) {
        res.setHeader('auth', '');
        return res.status(200).json({
            error: 0,
            message: 'Logout Successfully'
        });
    }

    @ApiCreatedResponse({
        type: ResponseRegister,
        description: 'The record has been successfully created.'
    })
    @ApiBody({
        type: BodyRegister
    })
    @Post('register')
    async register(
        @Body() body: BodyRegister,
        @Response() res
    ): Promise<ResponseRegister> {
        let newUser = new User();
        newUser.username = body.username;
        newUser.password = body.password;
        newUser.name = body.name;
        newUser.phone = body.phone;
        newUser.address = body.address;
        newUser.role = <any>null;

        try {
            const user = await this.authService.isNotExisting(body.username);
            if (!user) {
                return res.status(409).json({
                    error: 1,
                    message: 'The account already in use'
                });
            } else {
                await this.authService.create(newUser);
                return res.status(200).json({
                    error: 0,
                    message: 'Sign Up Successfully'
                });
            }
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Server occurred an error'
            });
        }
    }
}
