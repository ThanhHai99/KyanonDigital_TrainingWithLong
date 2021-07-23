import { Controller, Post, Body, Response } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserDto } from '../../users/user.dto';
import { User } from '../../users/users.entity';
import { LogInService } from './login.service';
require('dotenv').config();

@Controller('login')
export class LogInController {
    constructor(private logInService: LogInService) {}

    @Post()
    async index(@Body() userDto: UserDto, @Response() res) {
        let _user = new User();
        _user.username = userDto.username;
        _user.password = userDto.password;

        // Check if username and password are set
        if (!(_user.username && _user.password)) {
            return res.status(400).json({
                error: 1,
                message: 'Username and password are not set'
            });
        }

        let user: User;
        try {
            // Get user from logIn service
            user = await this.logInService.isExisting(_user);
        } catch (error) {
            return res.status(401).json({
                error: 1,
                message: 'Server occur an error'
            });
        }

        // Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(_user.password)) {
            return res.status(401).json({
                error: 1,
                message: 'Password is invalid'
            });
        }

        // Check if user is locked
        if (user.is_locked) {
            return res.status(401).json({
                error: 1,
                message: 'Your account is locked'
            });
        }

        // Sing jwt
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.jwtSecret,
            { expiresIn: process.env.tokenLifetime }
        );

        // Send the jwt in the response
        res.setHeader('auth', token);
        return res.status(200).json({
            error: 0,
            message: 'Sign In successfully'
        });
    }
}
