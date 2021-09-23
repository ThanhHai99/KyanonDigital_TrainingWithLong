import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from '@module/user/user.service';
import { User } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [TypeOrmModule.forFeature([User]), UserService]
})
export class UserModule {}
