import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../entities/users.entity';

@Injectable()
export class RegisterService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async create(user: User): Promise<any> {
        await this.userRepository.save(user);
        return this.userRepository.find();
    }

    async isNotExisting(username: string): Promise<any> {
        const _user = await this.userRepository.find({ where: { username: username } });
        return _user.length === 0;
    }
}
