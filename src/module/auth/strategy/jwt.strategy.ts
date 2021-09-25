import { UserService } from '@module/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret')
    });
  }

  async validate(payload: any) {
    // const _username = payload.username;
    // const user = await this.userService.findOne(_username);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // const { id, username, name, phone, address } = user;

    // attach into request.user
    return {
      userId: payload.id,
      username: payload.username,
      name: payload.name,
      phone: payload.phone,
      address: payload.address
    };
  }
}
