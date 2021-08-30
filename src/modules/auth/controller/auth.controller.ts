import { Controller, Post, Body, Response, Get } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
    BodyLogin,
    BodyRegister,
    ResponseLogin,
    ResponseRegister
} from 'src/modules/auth/dto/auth.dto';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { UsersService } from 'src/modules/user/service/users.service';
import { User } from '../../user/entity/users.entity';
require('dotenv').config();

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Post('login')
    async Login(
        @Body() body: BodyLogin,
        @Response() res
    ): Promise<ResponseLogin> {
        const { username, password } = body;

        let user: User = await this.usersService.isExisting(username);
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
                process.env.jwtSecret,
                { expiresIn: process.env.tokenLifetime }
            );
        } else {
            token = jwt.sign(
                {
                    userId: user.id,
                    username: user.username,
                    roleId: null
                },
                process.env.jwtSecret,
                { expiresIn: process.env.tokenLifetime }
            );
        }

        // Send the jwt in the response
        res.setHeader('auth', token);
        return res.status(200).json({
            error: 0,
            message: 'Sign In successfully'
        });
    }

    @Get('logout')
    async index(@Response() res) {
        res.setHeader('auth', '');
        return res.status(200).json({
            error: 0,
            message: 'Logout Successfully'
        });
    }

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
        newUser.role = <any>4;

        try {
            const user = await this.authService.isNotExisting(
                body.username
            );
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
