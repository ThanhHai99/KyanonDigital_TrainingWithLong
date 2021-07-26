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
        .setVersion('0.0.1')
        .addTag('v0.0.1')
        .addBasicAuth()
        .addSecurity('basic', {
            type: 'http',
            scheme: 'basic'
        })
        .build();

    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            methodKey
    };

    const customOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            persistAuthorization: true
        },
        customSiteTitle: 'My API Docs'
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('/', app, document, customOptions);

    let port = process.env.APP_PORT || 3000;
    await app.listen(port);
}
bootstrap();
