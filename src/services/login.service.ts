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

    isExisting(user: User): Promise<any> {
        return this.userRepository.findOneOrFail({
            select: [
                'id',
                'username',
                'password'
            ],
            where: { username: user.username },
            join: {
                alias: 'users',
                leftJoinAndSelect: {
                    role: 'users.role'
                }
            }
        });
    }

    checkPassword(user: User): Promise<any> {
        return user.checkIfUnencryptedPasswordIsValid(user.password);
    }
}
