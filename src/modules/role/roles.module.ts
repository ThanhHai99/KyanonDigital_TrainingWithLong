import { Module } from '@nestjs/common';
import { RolesController } from './controller/roles.controller';
import { Role } from './entity/roles.entity';
import { RolesService } from './service/roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    controllers: [RolesController],
    providers: [RolesService]
})
export class RolesModule {}
