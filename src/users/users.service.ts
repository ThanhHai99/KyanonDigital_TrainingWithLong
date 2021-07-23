import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { EntityId } from 'typeorm/repository/EntityId';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    readAll(): Promise<any> {
        return this.userRepository.find({
            select: [
                'id',
                'username',
                'name',
                'phone',
                'address',
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

    readOne(name: string, phone: string): Promise<any> {
        if (name !== undefined && phone === undefined)
            return this.userRepository.findOne({
                select: [
                    'id',
                    'username',
                    'name',
                    'phone',
                    'address',
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

    async create(user: User): Promise<any> {
        await this.userRepository.save(user);
        return this.userRepository.find();
    }

    // async update(id: EntityId, data: any): Promise<any> {
    //     console.log(data);
    // await this.userRepository.update(id, data);
    // const status = await this.userRepository.update(id, data);
    // return status;
    // return this.userRepository.findOne(id);
    // }

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
