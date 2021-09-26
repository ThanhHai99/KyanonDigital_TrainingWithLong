import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { In, Repository } from 'typeorm';
import {
  RolesAsObject as initRoles,
  RoleIds
} from '@constant/role/role.constant';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async onModuleInit() {
    if (RoleIds.length) {
      const existedRoles = await this.roleRepository.find({
        where: {
          id: In(RoleIds)
        }
      });

      if (existedRoles.length < RoleIds.length) {
        const existedIds = existedRoles.map((e) => e.id);
        const lackingIds = RoleIds.filter((e) => !existedIds.includes(e));
        const lackingRoles = Object.entries(initRoles)
          .filter((e: any) => lackingIds.includes(e[1]))
          .map((e) => {
            return {
              id: e[1],
              name: e[0]
            };
          });
        if (lackingRoles.length) {
          await this.roleRepository.insert(<any>lackingRoles);
        }
      }
    }
  }

  getAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  getById(id: number): Promise<Role> {
    return this.roleRepository.findOne({
      where: {
        id: id
      }
    });
  }
}
