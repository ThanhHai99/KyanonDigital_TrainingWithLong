import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../users/users.entity';

@Injectable()
export class SignInService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {};

    isExist(user: User): Promise<any> {
        return this.userRepository.findOneOrFail({ where: { username: user.username } });
    };

    checkPassword(user: User): Promise<any> {
        return user.checkIfUnencryptedPasswordIsValid(user.password);
    };
};
