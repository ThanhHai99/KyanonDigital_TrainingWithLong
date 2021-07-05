import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Authenticate } from './users/authenticate.middleware';
import { User } from './users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "test",
      entities: [User],
      synchronize: true
    }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  constructor(private connection: Connection) {}
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Authenticate)
      .forRoutes({ path: "users", method: RequestMethod.GET })
  };
};
