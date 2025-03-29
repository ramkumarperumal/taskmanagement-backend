import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseMessage, ResponseStatus } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (error) => {
        const firstError = error[0];
        const msg = Object.values(firstError.constraints)[0];
        return new BadRequestException({
          statusCode: ResponseStatus.BAD_REQUEST,
          message: msg,
          error: ResponseMessage.BAD_REQUEST,
        });
      },
    }),
  );
  await app.listen(process.env.SERVER_PORT ?? 3001);
}
bootstrap();
