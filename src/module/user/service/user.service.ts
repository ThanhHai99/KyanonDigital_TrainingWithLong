import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async _findOne(id: number): Promise<User> {
        return await this.userRepository.findOne(id);
    }

    async isExisting(username: string): Promise<User> {
        return await this.userRepository.findOne({
            where: { username: username },
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    role: 'user.role'
                }
            }
        });
    }

    async getAll(): Promise<User[]> {
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
                alias: 'user',
                leftJoinAndSelect: {
                    role: 'user.role'
                }
            }
        });
    }

    async getById(id: number): Promise<User> {
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
                alias: 'user',
                leftJoinAndSelect: {
                    role: 'user.role'
                }
            }
        });
    }

    async getByName(name: string): Promise<User[]> {
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
            where: {
                name: Like('%' + name + '%')
            },
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    role: 'user.role'
                }
            }
        });
    }

    async getByPhone(phone: string): Promise<User[]> {
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
            where: {
                phone: Like('%' + phone + '%')
            },
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    role: 'user.role'
                }
            }
        });
    }

    async getByNameAndPhone(name: string, phone: string): Promise<User[]> {
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
            where: {
                name: Like('%' + name + '%'),
                phone: Like('%' + phone + '%')
            },
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    role: 'user.role'
                }
            }
        });
    }

    async create(user: User): Promise<any> {
        const rs = await this.userRepository.save(user);
        return this.getById(rs.id);
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
