import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
    SwaggerCustomOptions,
    SwaggerDocumentOptions
} from './configs/swagger.config';
require('dotenv').config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Shopping Online')
        .setDescription('The API Description')
        .setVersion('1.0.0')
        .addTag('v1.0.0')
        .addBasicAuth()
        .addSecurity('basic', {
            type: 'http',
            scheme: 'basic'
        })
        .build();

    // const options: SwaggerDocumentOptions = {
    //     operationIdFactory: (controllerKey: string, methodKey: string) =>
    //         methodKey
    // };

    // const customOptions: SwaggerCustomOptions = {
    //     swaggerOptions: {
    //         persistAuthorization: true
    //     },
    //     customSiteTitle: 'My API Docs'
    // };
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

    let port = process.env.APP_PORT || 3000;
    await app.listen(port);
}
bootstrap();
