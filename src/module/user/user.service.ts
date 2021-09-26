import { Role } from '@module/role/role.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username: username } });
  }

  async getAll(filter: any = {}): Promise<any> {
    const users: User[] = await this.userRepository.find(filter);
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async getById(id: number): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: {
        id: id
      }
    });
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
    const isUserExists = await this.findOne(username);
    if (isUserExists) {
      throw new HttpException(
        'The account already in use',
        HttpStatus.CONFLICT
      );
    }

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
    is_locked: boolean,
    role_id: number
  ): Promise<InsertResult> {
    const isUserExists = await this.findOne(username);
    const thisRole = await this.roleRepository.findOne({
      where: {
        id: role_id
      }
    });
    if (!thisRole || thisRole.id === 1)
      throw new HttpException('Role is incorrect', HttpStatus.NOT_FOUND);
    if (isUserExists)
      throw new HttpException(
        'The account already in use',
        HttpStatus.CONFLICT
      );

    const newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.name = name;
    newUser.phone = phone;
    newUser.address = address;
    newUser.role = role_id;
    newUser.is_locked = is_locked || false;
    const result = await this.userRepository.insert(newUser);
    if (!result) {
      throw new HttpException(
        'The account cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }

  async update(
    id: number,
    password: string,
    name: string,
    phone: string,
    address: string,
    is_locked: boolean,
    role_id: number
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      }
    });

    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);

    user.password = password || user.password;
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.is_locked = is_locked || user.is_locked;
    user.role = role_id || user.role;

    // Check role
    if (role_id) {
      const thisRole = await this.roleRepository.findOne({
        where: {
          id: role_id
        }
      });
      if (!thisRole || id === 1)
        throw new HttpException('Role is incorrect', HttpStatus.NOT_FOUND);
    }

    const result = await this.userRepository.update(id, user);
    if (!result) {
      throw new HttpException(
        'The account cannot update',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }
}
