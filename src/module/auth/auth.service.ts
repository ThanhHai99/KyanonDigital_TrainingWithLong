import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '@module/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@module/user/user.entity';
import { BodyRegister } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async create(data: BodyRegister, hostname: string): Promise<any> {
    await this.userService.create(data, hostname);
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

    await this.userService.update(user.id, {
      is_active: true
    });
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
