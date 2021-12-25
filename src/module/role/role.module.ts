import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'
import { Role } from './role.entity'
import { RoleService } from './role.service'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [TypeOrmModule, RoleService]
})
export class RoleModule {}
