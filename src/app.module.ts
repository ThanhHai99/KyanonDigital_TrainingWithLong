import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { SignUpModule } from './sign_up/sign_up.module';
import { SignInModule } from './sign_in/sign_in.module';
import { checkJwt } from './middlewares/checkJwt';
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
            entities: [User],
            synchronize: true
        }),
        UsersModule,
        SignUpModule,
        SignInModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    constructor(private connection: Connection) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(checkJwt).forRoutes('users');
    }
}
