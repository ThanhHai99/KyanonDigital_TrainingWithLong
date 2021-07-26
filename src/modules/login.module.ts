import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogInService } from '../services/login.service';
import { LogInController } from './../controllers/login.controller';
import { User } from 'src/entities/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [LogInService],
    controllers: [LogInController]
})
export class LoginModule {}
