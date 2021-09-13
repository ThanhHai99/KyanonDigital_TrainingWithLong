import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async onModuleInit() {
        const existedUsers = await this.userRepository.find({
            where: {
                id: 1
            }
        });

        if (existedUsers.length < 1) {
            const existedIds = existedUsers.map((e) => e.id);
            const lackingIds = [1].filter((e) => !existedIds.includes(e));

            const lackingUsers = Array([
                1,
                'hai',
                bcrypt.hashSync('Aa@123456', 8),
                'Tran Viet Thanh Hai',
                '0333771800',
                'Tp.HCM',
                0,
                1
            ])
                .filter((e: any) => lackingIds.includes(e[0]))
                .map((e) => {
                    return {
                        id: e[0],
                        username: e[1],
                        password: e[2],
                        name: e[3],
                        phone: e[4],
                        address: e[5],
                        is_locked: e[6],
                        role_id: e[7]
                    };
                });
            console.log('lackingUsers');
            console.log(lackingUsers);
            if (lackingUsers.length) {
                await this.userRepository.insert(<any>lackingUsers);
            }
        }
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

    async getAll(filter: any = {}): Promise<any> {
        return this.userRepository.find(filter);
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
