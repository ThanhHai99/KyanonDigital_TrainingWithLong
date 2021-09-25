import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

const NODE_ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/${NODE_ENV ? '.' + NODE_ENV.trim() : ''}.env`,
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username').toString(),
        password: configService.get<string>('database.password').toString(),
        database: configService.get<string>('database.db_name').toString(),
        autoLoadEntities: true,
        //WARNING: Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
        // INFO: Setting synchronize: false cannot generate table in database
        synchronize: true
      })
    })
  ],
  exports: [ConfigModule, TypeOrmModule]
})
export class CoreModule {}
