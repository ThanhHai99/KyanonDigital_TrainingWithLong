import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) {}

    findAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }
}
