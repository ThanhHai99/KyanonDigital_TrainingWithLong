import { Controller, Post, Body, Response } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { BodyLogin, ResponseLogin } from 'src/dto/auth.dto';
import { User } from '../entities/users.entity';
import { LogInService } from '../services/login.service';
require('dotenv').config();

@Controller('login')
export class LogInController {
    constructor(private logInService: LogInService) {}

    @Post()
    async index(
        @Body() body: BodyLogin,
        @Response() res
    ): Promise<ResponseLogin> {
        const { username, password } = body;

        let user: User;
        user = await this.logInService.isExisting(username);
        if (!user) {
            return res.status(401).json({
                error: 1,
                message: 'Username or password are invalid'
            });
        }

        const isValidPassword = this.logInService.checkPassword(user, password);
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
}
