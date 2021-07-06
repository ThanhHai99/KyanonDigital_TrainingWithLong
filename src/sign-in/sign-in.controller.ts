import { Controller, Get, Post, Param, Body, Delete, Query } from '@nestjs/common';
import { CreateUserDto } from './../users/create-user.dto';
import { User } from './../users/users.entity';
import { SignInService } from './sign-in.service';

@Controller('signIn')
export class SignInController {
    constructor(private signInService: SignInService) {};

    @Post()
    async index(@Body() createUserDto: CreateUserDto) {
        let user = new User();
        user.username = createUserDto.username;
        user.password = createUserDto.password;
        user.name = createUserDto.name;
        
        try {
            const users = await this.signInService.isExist(user);
            if (!users.checkIfUnencryptedPasswordIsValid(user.password)) {
                return "Invalid username or password";
            };
            return "Sign in successfully";
        } catch (error) {
            return "Error";
        };
    };
};
