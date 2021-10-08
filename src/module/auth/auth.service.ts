import { Injectable } from '@nestjs/common';
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
    this.mailerService.sendMail({
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
