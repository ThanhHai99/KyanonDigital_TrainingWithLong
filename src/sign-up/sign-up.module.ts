import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignUpService } from './sign-up.service';
import { SignUpController } from './sign-up.controller';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SignUpService],
  controllers: [SignUpController]
})

export class SignUpModule {};
