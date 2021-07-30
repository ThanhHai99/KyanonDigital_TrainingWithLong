import { Controller, Post, Body, Response } from '@nestjs/common';
import { CreateUserDto } from '../dto/create_user.dto';
import { User } from '../entities/users.entity';
import { RegisterService } from '../services/register.service';
import { validate } from 'class-validator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('register')
export class RegisterController {
    constructor(private registerService: RegisterService) {}

    @Post()
    async index(@Body() createUserDto: CreateUserDto, @Response() res) {
        let newUser = new User();
        newUser.username = createUserDto.username;
        newUser.password = createUserDto.password;
        newUser.name = createUserDto.name;
        newUser.phone = createUserDto.phone;
        newUser.address = createUserDto.address;
        newUser.role = null;

        const errors = await validate(newUser);
        if (errors.length > 0) {
            return res.status(400).json({
                error: 1,
                data: errors
            });
        }

        try {
            const user = await this.registerService.isNotExisting(newUser);
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
