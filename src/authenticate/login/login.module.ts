import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogInService } from './login.service';
import { LogInController } from './login.controller';
import { User } from 'src/users/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [LogInService],
    controllers: [LogInController]
})
export class LoginModule {}
