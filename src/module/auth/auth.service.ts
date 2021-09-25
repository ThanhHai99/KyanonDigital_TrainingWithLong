import { Injectable } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { UserService } from '@module/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async create(
    username: string,
    password: string,
    name: string,
    phone: string,
    address: string
  ): Promise<InsertResult> {
    const result = await this.userService.create(
      username,
      password,
      name,
      phone,
      address
    );
    return result;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.isPasswordValid(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    const payload = {
      id: user.id,
      username: user.username,
      name: user.name,
      phone: user.phone,
      address: 'user.address'
    };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
