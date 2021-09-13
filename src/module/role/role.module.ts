import { Module } from '@nestjs/common';
import { RoleController } from './controller/role.controller';
import { Role } from './entity/role.entity';
import { RoleService } from './service/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [TypeOrmModule.forFeature([Role]), RoleService]
})
export class RoleModule {}
