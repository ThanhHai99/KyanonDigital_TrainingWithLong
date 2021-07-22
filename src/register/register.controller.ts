import { Controller, Post, Body, Response } from '@nestjs/common';
import { CreateUserDto } from '../users/create_user.dto';
import { User } from '../users/users.entity';
import { SignUpService } from './register.service';

@Controller('register')
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
                return res.status(409).json({
                    error: 1,
                    message: 'The account already in use'
                });
            } else {
                await this.signUpService.create(user0);
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
