import { Module } from '@nestjs/common';
import { RoleController } from '@module/role/controller/role.controller';
import { Role } from '@module/role/entity/role.entity';
import { RoleService } from '@module/role/service/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [TypeOrmModule.forFeature([Role]), RoleService]
})
export class RoleModule {}
