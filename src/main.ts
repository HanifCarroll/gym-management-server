import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Ensure incoming dating is validated using rules defined in DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip away un-decorated properties on the DTO
      forbidNonWhitelisted: true, // Throw an error if there are unrecognized properties
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Gym Management Server')
    .setDescription('Server for the gym management application suite.')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
