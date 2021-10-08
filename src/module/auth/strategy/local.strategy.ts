import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password'
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user || user.is_locked) {
      throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
    }

    if (user.is_locked) {
      throw new HttpException('Account is locked', HttpStatus.UNAUTHORIZED);
    }

    if (!user.is_active) {
      throw new HttpException(
        'Account is not activated',
        HttpStatus.UNAUTHORIZED
      );
    }
    return user;
  }
}
