import { Controller, Post, Body, Response } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './../users/create_user.dto';
import { User } from './../users/users.entity';
import { SignInService } from './sign_in.service';
require('dotenv').config();

@Controller('sign_in')
export class SignInController {
    constructor(private signInService: SignInService) {}

    @Post()
    async index(@Body() createUserDto: CreateUserDto, @Response() res) {
        let user0 = new User();
        user0.username = createUserDto.username;
        user0.password = createUserDto.password;

        // Check if username and password are set
        if (!(user0.username && user0.password)) {
            return res.status(400).send();
        }

        let user: User;
        try {
            // Get user from signIn service
            user = await this.signInService.isExist(user0);
        } catch (error) {
            return res.status(401).send();
        }

        // Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(user0.password)) {
            return res.status(401).send();
        }

        // Sing jwt
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.jwtSecret,
            { expiresIn: process.env.tokenLifetime }
        );

        // Send the jwt in the response
        res.setHeader('auth', token);
        return res.status(200).send('Sign in successfully');
    }
}
