import { Injectable } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@module/user/entity/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    @ApiParam({ name: 'user', type: User })
    async create(user: User): Promise<any> {
        await this.userRepository.save(user);
        return this.userRepository.find();
    }

    async isNotExisting(username: string): Promise<any> {
        const _user = await this.userRepository.find({ where: { username: username } });
        return _user.length === 0;
    }
}
