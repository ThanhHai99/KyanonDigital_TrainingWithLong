import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';

@Injectable()
export class LogInService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async isExisting(username: string): Promise<User> {
        return await this.userRepository.findOneOrFail({
            where: { username: username },
            join: {
                alias: 'users',
                leftJoinAndSelect: {
                    role: 'users.role'
                }
            }
        });
    }

    checkPassword(user: User, password: string): Boolean {
        return user.checkIfUnencryptedPasswordIsValid(password);
    }
}
