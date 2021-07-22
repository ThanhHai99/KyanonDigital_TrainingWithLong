import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignInService } from './sign_in.service';
import { SignInController } from './sign_in.controller';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SignInService],
  controllers: [SignInController]
})

export class SignInModule {};
