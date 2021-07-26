import { Module } from '@nestjs/common';
import { RolesController } from '../controllers/roles.controller';
import { Role } from '../entities/roles.entity';
import { RolesService } from '../services/roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    controllers: [RolesController],
    providers: [RolesService]
})
export class RolesModule {}
