import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically strip properties that do not have any decorators
    forbidNonWhitelisted: true, // Throw an error if properties are not allowed
    transform: true, // Automatically transform payloads to the DTO types
  }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Library System API')
    .setDescription('API documentation for the Library System')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
