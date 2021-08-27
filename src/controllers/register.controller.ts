import { Controller, Post, Body, Response } from '@nestjs/common';
import { RegisterService } from '../services/register.service';
import { BodyRegister, ResponseRegister } from 'src/dto/auth.dto';
import { User } from 'src/entities/users.entity';

@Controller('register')
export class RegisterController {
    constructor(private registerService: RegisterService) {}

    @Post()
    async index(@Body() body: BodyRegister, @Response() res): Promise<ResponseRegister> {
        let newUser = new User();
        newUser.username = body.username;
        newUser.password = body.password;
        newUser.name = body.name;
        newUser.phone = body.phone;
        newUser.address = body.address;
        newUser.role = null;

        try {
            const user = await this.registerService.isNotExisting(
                body.username
            );
            if (!user) {
                return res.status(409).json({
                    error: 1,
                    message: 'The account already in use'
                });
            } else {
                await this.registerService.create(newUser);
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
