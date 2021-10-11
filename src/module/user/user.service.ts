import { RoleIds } from '@constant/role/role.constant';
import { Role } from '@module/role/role.entity';
import { RoleService } from '@module/role/role.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import { BodyCreateUser, BodyUpdateUser } from './user.dto';
import { BodyRegister } from '@module/auth/auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(
    private readonly roleService: RoleService,
    private readonly mailerService: MailerService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findByUsernameAndSelectRole(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username: username },
      relations: ['role']
    });
  }

  async findByIdAndSelectRole(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['role']
    });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username: username } });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async findByVerifyToken(token: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { verify_token: token }
    });
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

  async create(data: BodyRegister, hostname: string): Promise<any> {
    // Check username exists
    const isUserExists = await this.findByUsername(data.username);
    if (isUserExists)
      throw new HttpException(
        'The account already in use',
        HttpStatus.CONFLICT
      );

    // Create user
    data.password = bcrypt.hashSync(data.password, 8);
    data.verify_token = uuidv4();
    await this.userRepository
      .save(data)
      .then((resolve) => {
        const url = `${hostname}/auth/verify/${data.verify_token}`;
        this.mailerService.sendMail({
          from: '"Support Team" <tranvietthanhhai2@gmail.com>',
          to: data.username,
          subject: 'Welcome to Shopping App! Confirm your Email',
          template: './index', // `.hbs` extension is appended automatically
          context: {
            name: data.name,
            url
          }
        });
      })
      .catch((reject) => {
        throw new HttpException(
          'The account cannot create',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }

  async createEmployee(data: BodyCreateUser): Promise<any> {
    // Check user name exists
    const isUserExists = await this.findByUsername(data.username);
    if (isUserExists)
      throw new HttpException(
        'The account already in use',
        HttpStatus.CONFLICT
      );

    // Check role valid
    const thisRole = await this.roleService.findById(data.role);
    if (!thisRole || thisRole.id === 1)
      throw new HttpException('Role is incorrect', HttpStatus.NOT_FOUND);

    // Create user
    data.is_active = true;
    data.password = bcrypt.hashSync(data.password, 8);
    data.verify_token = uuidv4();
    await this.userRepository.save(data).catch((reject) => {
      throw new HttpException(
        'The account cannot create',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }

  async isEmployee(userId: number): Promise<boolean> {
    const user = await this.findByIdAndSelectRole(userId);
    const { role } = user;
    const _role = <Role>role;
    if (!_role) return false;
    const { id: roleId } = _role;

    if (RoleIds.includes(roleId)) return true;
    return false;
  }

  async update(id: number, data: Partial<BodyUpdateUser>): Promise<any> {
    // Check user exists
    const user = await this.userRepository.findOne(id);
    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);

    // Check role
    if (data.role) {
      const thisRole = await this.roleService.findById(data.role);
      if (!thisRole || id === 1)
        throw new HttpException('Role is incorrect', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(id, data).catch((reject) => {
      throw new HttpException(
        'The account cannot update',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }
}
