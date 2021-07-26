import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users.module';
import { User } from './entities/users.entity';
import { RegisterModule } from './modules/register.module';
import { LoginModule } from './modules/login.module';
import { checkJwt } from './middlewares/checkJwt';
import { LogoutModule } from './modules/logout.module';
import { RolesModule } from './modules/roles.module';
import { Role } from './entities/roles.entity';
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
        consumer.apply(checkJwt).forRoutes('users');
        consumer.apply(checkJwt).forRoutes('roles');
    }
}
