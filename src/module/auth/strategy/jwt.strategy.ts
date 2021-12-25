import { Role } from '@module/role/role.entity'
import { UserService } from '@module/user/user.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret')
    })
  }

  async validate(payload: any) {
    const payloadUsername = payload.username
    const user = await this.userService.findByUsernameAndSelectRole(payloadUsername)
    if (!user) throw new UnauthorizedException()

    // req.user
    const { role } = user
    const _role: Role = <Role>role
    if (!_role)
      return {
        id: payload.id,
        username: payload.username,
        roleId: null
      }

    const { id: roleId } = _role
    return {
      id: payload.id,
      username: payload.username,
      roleId: roleId
    }
  }
}
