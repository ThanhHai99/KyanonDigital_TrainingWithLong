import {
  Controller,
  Post,
  Body,
  Response,
  UseGuards,
  Get,
  HttpStatus
} from '@nestjs/common';
import { BodyLogin, BodyRegister, ResponseRegister } from './auth.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local.guard';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: 'Login is successful!' })
  @ApiUnauthorizedResponse({ description: 'Incorrect email or password!' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: BodyLogin): Promise<any> {
    return this.authService.login(body);
  }

  @ApiOkResponse({ description: 'Logout is successful!' })
  @Get('logout')
  async logout(@Response() res) {}

  @ApiCreatedResponse({
    type: ResponseRegister,
    description: 'The record has been successfully created.'
  })
  @ApiBody({
    type: BodyRegister
  })
  @Post('register')
  async register(@Body() body: BodyRegister, @Response() res): Promise<any> {
    const { username, password, name, phone, address } = body;
    await this.authService.create(username, password, name, phone, address);
    return res.status(HttpStatus.CREATED).json({
      error: 0,
      message: 'Sign up successfully'
    });
  }
}
