import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService)
  const PORT = config.get('API_PORT')
  app.useGlobalPipes(new ValidationPipe())
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Articles service')
  .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('/api', app, document)
  await app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
}
bootstrap();
