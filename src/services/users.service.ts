import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/users.entity';
import { EntityId } from 'typeorm/repository/EntityId';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async findOne(id: EntityId): Promise<User> {
        return await this.userRepository.findOne(id);
    }

    readAll(): Promise<User[]> {
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

    readOne(name: string, phone: string): Promise<User> {
        if (name !== undefined && phone === undefined)
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
        else if (name === undefined && phone !== undefined)
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
        else
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
                    name: name,
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

    async isSuperAdmin(id: EntityId): Promise<any> {
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

    async lock(id: EntityId): Promise<any> {
        await this.userRepository.update(id, { is_locked: true });
    }
}
