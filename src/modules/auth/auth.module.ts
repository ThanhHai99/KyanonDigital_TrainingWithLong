import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entity/users.entity';
import { UsersService } from 'src/modules/user/service/users.service';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { AuthController } from 'src/modules/auth/controller/auth.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AuthService, UsersService],
    controllers: [AuthController]
})
export class AuthModule {}
