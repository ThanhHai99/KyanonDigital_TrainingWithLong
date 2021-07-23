import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/users.entity';

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

    async isNotExisting(user: User): Promise<any> {
        let u = await User.find({ where: { username: user.username } });
        return u.length === 0;
    }
}
