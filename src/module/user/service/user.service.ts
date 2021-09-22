import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@module/user/entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

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
