import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '@module/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@module/user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async create(
    username: string,
    password: string,
    name: string,
    phone: string,
    address: string,
    hostname: string
  ): Promise<User> {
    const result = await this.userService.create(
      username,
      password,
      name,
      phone,
      address
    );

    const url = `${hostname}/auth/verify/${result.verify_token}`;
    console.log('url verify');
    console.log(url);
    await this.mailerService.sendMail({
      from: '"Support Team" <tranvietthanhhai2@gmail.com>',
      to: result.username,
      subject: 'Welcome to Shopping App! Confirm your Email',
      template: './index', // `.hbs` extension is appended automatically
      context: {
        name: result.name,
        url
      }
    });

    return result;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && user.isPasswordValid(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async verifyEmail(token: string): Promise<any> {
    const user = await this.userService.findByVerifyToken(token);
    if (!user)
      throw new HttpException(
        'The account is not exists',
        HttpStatus.NOT_FOUND
      );

    user.is_active = true;
    await this.userService.update(
      user.id,
      user.password,
      user.name,
      user.phone,
      user.address,
      user.is_locked,
      <number>user.role,
      user.is_active
    );
  }

  async login(user: any): Promise<any> {
    const _user: User = await this.userService.findByUsername(user.username);
    const payload = {
      username: _user.username,
      id: _user.id
    };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
