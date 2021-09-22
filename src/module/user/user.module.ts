import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@module/user/controller/user.controller';
import { UserService } from '@module/user/service/user.service';
import { User } from '@module/user/entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [TypeOrmModule.forFeature([User]), UserService]
})
export class UserModule {}
