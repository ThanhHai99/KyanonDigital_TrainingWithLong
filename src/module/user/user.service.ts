import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User> // @InjectRepository(Role) // private readonly roleRepository: Repository<Role>
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username: username });
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

  async update(user: User): Promise<User> {
    await this.userRepository.save(user);
    return await this.getById(user.id);
  }

  async isSuperAdmin(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          role: 'user.role'
        }
      }
    });
    if (!user) return false;
    return user.role;
  }

  async isUsernameAlreadyInUse(username: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          username: username
        }
      });
      if (user) return true;
      return false;
    } catch (error) {
      return false;
    }
  }

  async lock(id: number): Promise<any> {
    await this.userRepository.update(id, { is_locked: true });
  }
}
