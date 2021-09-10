import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from '../user/user.module';

@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
