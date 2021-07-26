import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterService } from '../services/register.service';
import { RegisterController } from '../controllers/register.controller';
import { User } from 'src/entities/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [RegisterService],
    controllers: [RegisterController]
})
export class RegisterModule {}
