import { Module } from '@nestjs/common';
import { AuthService } from '@module/auth/service/auth.service';
import { AuthController } from '@module/auth/controller/auth.controller';
import { UserModule } from '@module/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
