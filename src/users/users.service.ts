import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {};

    getAll(): Promise<any> {
        return this.userRepository.find();
    };

    getById(id: string): Promise<any> {
        return this.userRepository.findOne(id);
    };

    async create(user: User): Promise<any> {
        await this.userRepository.save(user);
        return this.userRepository.find();
    };

    async delete(id: string): Promise<any> {
        let userToRemove = await this.userRepository.findOne(id);
        await this.userRepository.remove(userToRemove);
        return this.userRepository.find();
    };
};
