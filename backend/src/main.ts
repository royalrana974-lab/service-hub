/**
 * Main entry point for the NestJS application
 * Initializes the application, configures global pipes, CORS, and starts the server
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Bootstrap function that creates and configures the NestJS application
 * Sets up global validation pipes, CORS, and starts listening on the configured port
 */
async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Configure global validation pipe to automatically validate incoming requests
  // whitelist: strips properties that don't have decorators
  // forbidNonWhitelisted: throws error if non-whitelisted properties are present
  // transform: automatically transforms payloads to DTO instances
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS (Cross-Origin Resource Sharing) for all origins
  // Allows the API to be accessed from any frontend domain
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Get port from environment variable or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
