import { Controller, Post, Body, Response } from '@nestjs/common';
import { UserDto } from '../../users/user.dto';
import { User } from '../../users/users.entity';
import { RegisterService } from './register.service';
import { validate } from 'class-validator';
const moment = require('moment');

@Controller('register')
export class RegisterController {
    constructor(private registerService: RegisterService) {}

    @Post()
    async index(@Body() userDto: UserDto, @Response() res) {
        let newUser = new User();
        newUser.username = userDto.username;
        newUser.password = userDto.password;
        newUser.name = userDto.name;
        newUser.phone = userDto.phone;
        newUser.address = userDto.address;
        newUser.role = null;
        newUser.created_at = moment().format('YYYY/MM/DD HH:mm');
        newUser.updated_at = moment().format('YYYY/MM/DD HH:mm');
        
        const errors = await validate(newUser);
        if (errors.length > 0) {
            return res.status(400).json({
                error: 1,
                data: errors
            });
        }
        
        try {
            newUser.hashPassword();
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
