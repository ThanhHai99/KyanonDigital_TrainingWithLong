import { Controller } from '@nestjs/common';
import { Get, Response } from '@nestjs/common';

@Controller('logout')
export class LogoutController {
    @Get()
    async index(@Response() res) {
        res.setHeader('auth', '');
        return res.status(200).json({
            error: 0,
            message: 'Logout Successfully'
        });
    }
}
