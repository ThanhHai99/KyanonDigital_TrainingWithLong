import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('port');

    app.useGlobalPipes(new ValidationPipe());
    const config = new DocumentBuilder()
        .setTitle('Shopping Online')
        .setDescription('The API Description')
        .setVersion('1.0.0')
        .addTag('v1.0.0')
        .addApiKey(
            {
                type: 'apiKey',
                name: 'auth',
                in: 'header'
            },
            'JwtAuthGuard'
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

    app.enableCors();
    await app.listen(port).then(() => {
        Logger.log(`Server is listening on ${port}`);
    });
}
bootstrap();
