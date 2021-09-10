import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entity/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) {}

    getAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    getById(id: number): Promise<Role> {
        return this.roleRepository.findOne(id);
    }
}
