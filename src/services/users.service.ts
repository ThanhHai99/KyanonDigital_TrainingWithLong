import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOne(id);
    }

    async readAll(): Promise<User[]> {
        return this.userRepository.find({
            select: [
                'id',
                'username',
                'name',
                'phone',
                'address',
                'is_locked',
                'created_at',
                'updated_at'
            ],
            join: {
                alias: 'users',
                leftJoinAndSelect: {
                    role: 'users.role'
                }
            }
        });
    }

    async readById(id: number): Promise<User> {
        return this.userRepository.findOne({
            select: [
                'id',
                'username',
                'name',
                'phone',
                'address',
                'is_locked',
                'created_at',
                'updated_at'
            ],
            where: {
                id: id
            },
            join: {
                alias: 'users',
                leftJoinAndSelect: {
                    role: 'users.role'
                }
            }
        });
    }

    async readByName(name: string): Promise<User> {
        return this.userRepository.findOne({
            select: [
                'id',
                'username',
                'name',
                'phone',
                'address',
                'is_locked',
                'created_at',
                'updated_at'
            ],
            where: {
                name: name
            },
            join: {
                alias: 'users',
                leftJoinAndSelect: {
                    role: 'users.role'
                }
            }
        });
    }

    async readByPhone(phone: string): Promise<User> {
        return this.userRepository.findOne({
            select: [
                'id',
                'username',
                'name',
                'phone',
                'address',
                'is_locked',
                'created_at',
                'updated_at'
            ],
            where: {
                phone: phone
            },
            join: {
                alias: 'users',
                leftJoinAndSelect: {
                    role: 'users.role'
                }
            }
        });
    }

    async create(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async update(user: User): Promise<User> {
        await this.userRepository.save(user);
        return await this.findOne(user.id);
    }

    async isSuperAdmin(id: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                id: id
            },
            join: {
                alias: 'users',
                leftJoinAndSelect: {
                    role: 'users.role'
                }
            }
        });
        return user.role;
    }

    async lock(id: number): Promise<any> {
        await this.userRepository.update(id, { is_locked: true });
    }
}
