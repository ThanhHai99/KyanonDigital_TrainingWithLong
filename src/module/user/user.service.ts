import { RoleIds } from '@constant/role/role.constant';
import { RoleService } from '@module/role/role.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly roleService: RoleService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { username: username } });
  }

  async getAll(filter: any = {}): Promise<any> {
    const users: User[] = await this.userRepository.find(filter);
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async getById(id: number): Promise<User> {
    const user: User = await this.userRepository.findOne(id);
    delete user.password;
    return user;
  }

  async create(
    username: string,
    password: string,
    name: string,
    phone: string,
    address: string
  ): Promise<InsertResult> {
    // Check username exists
    const isUserExists = await this.findOne(username);
    if (isUserExists)
      throw new HttpException(
        'The account already in use',
        HttpStatus.CONFLICT
      );

    // Create user
    const newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.name = name;
    newUser.phone = phone;
    newUser.address = address;
    const result = await this.userRepository.insert(newUser);
    if (!result) {
      throw new HttpException(
        'The account cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return result;
  }

  async createEmployee(
    username: string,
    password: string,
    name: string,
    phone: string,
    address: string,
    isLocked: boolean,
    roleId: number
  ): Promise<InsertResult> {
    // Check user name exists
    const isUserExists = await this.findOne(username);
    if (isUserExists)
      throw new HttpException(
        'The account already in use',
        HttpStatus.CONFLICT
      );

    // Check role valid
    const thisRole = await this.roleService.findById(roleId);
    if (!thisRole || thisRole.id === 1)
      throw new HttpException('Role is incorrect', HttpStatus.NOT_FOUND);

    // Create user
    const newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.name = name;
    newUser.phone = phone;
    newUser.address = address;
    newUser.role = roleId;
    newUser.is_locked = isLocked || false;
    const result = await this.userRepository.insert(newUser);
    if (!result) {
      throw new HttpException(
        'The account cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }

  async isEmployee(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne(userId);
    const { role_id } = user;
    if (RoleIds.includes(role_id)) return true;
    return false;
  }

  async update(
    id: number,
    password: string,
    name: string,
    phone: string,
    address: string,
    isLocked: boolean,
    roleId: number
  ): Promise<UpdateResult> {
    // Check user exists
    const user = await this.userRepository.findOne(id);
    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);

    // Check role
    if (roleId) {
      const thisRole = await this.roleService.findById(roleId);
      if (!thisRole || id === 1)
        throw new HttpException('Role is incorrect', HttpStatus.NOT_FOUND);
    }

    // Update user
    user.password = password || user.password;
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.is_locked = isLocked || user.is_locked;
    user.role = roleId || user.role;
    const result = await this.userRepository.update(id, user);
    if (!result.affected) {
      throw new HttpException(
        'The account cannot update',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return result;
  }
}
