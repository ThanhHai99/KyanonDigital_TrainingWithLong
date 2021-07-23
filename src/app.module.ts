import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { RegisterModule } from './authenticate/register/register.module';
import { LoginModule } from './authenticate/login/login.module';
import { checkJwt } from './middlewares/checkJwt';
import { LogoutModule } from './authenticate/logout/logout.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.entity';
require('dotenv').config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [Role, User],
            synchronize: true
        }),
        RolesModule,
        UsersModule,
        RegisterModule,
        LoginModule,
        LogoutModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    constructor(private connection: Connection) {}

    configure(consumer: MiddlewareConsumer) {
        // consumer.apply(checkJwt).forRoutes('users');
    }
}
