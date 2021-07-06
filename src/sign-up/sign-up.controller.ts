import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './../users/create-user.dto';
import { User } from './../users/users.entity';
import { SignUpService } from './sign-up.service';

@Controller('signUp')
export class SignUpController {
    constructor(private signUpService: SignUpService) {};
    
    @Post()
    async index(@Body() createUserDto: CreateUserDto) {
        let user = new User();
        user.username = createUserDto.username;
        user.password = createUserDto.password;
        user.name = createUserDto.name;

        user.hashPassword();
        
        try {
            const u = await this.signUpService.checkNotExist(user);
            if (u === false) {
                return "User already in use";
            } else {
                const users = await this.signUpService.create(user);
                return users;
            };
        } catch (error) {
            return "Error";
        };
    };
};
