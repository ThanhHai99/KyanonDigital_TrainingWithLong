import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Res,
  Req
} from '@nestjs/common';
import { BodyLogin, BodyRegister } from './auth.dto';
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

  @ApiCreatedResponse({
    description: 'The record has been successfully created.'
  })
  @ApiBody({
    type: BodyRegister
  })
  @Post('register')
  async register(
    @Body() body: BodyRegister,
    @Res() res,
    @Req() req
  ): Promise<any> {
    const { username, password, name, phone, address } = body;
    await this.authService.create(
      username,
      password,
      name,
      phone,
      address,
      req.headers.host
    );
    return res.status(HttpStatus.CREATED).json({
      error: 0,
      message:
        'Sign up successfully, please check your mail to active this account'
    });
  }
}
