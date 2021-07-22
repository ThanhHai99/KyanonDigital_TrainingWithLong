import { Controller, Post, Body, Response } from '@nestjs/common';
import { CreateUserDto } from './../users/create_user.dto';
import { User } from './../users/users.entity';
import { SignUpService } from './sign_up.service';

@Controller('sign')
export class SignUpController {
    constructor(private signUpService: SignUpService) {}

    @Post()
    async index(@Body() createUserDto: CreateUserDto, @Response() res) {
        let user0 = new User();
        user0.username = createUserDto.username;
        user0.password = createUserDto.password;
        user0.name = createUserDto.name;
        user0.hashPassword();

        try {
            const user = await this.signUpService.checkNotExist(user0);
            if (user === false) {
                return res.status(409).send('The account already in use');
            } else {
                await this.signUpService.create(user0);
                return res.status(201).send('Sign up successfully');
            }
        } catch (error) {
            return res.status(500).send('Server occurred an error');
        }
    }
}
