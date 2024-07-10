import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2/');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // ESTO ES UNA MANERA DE RESOLVER LA PAGINACION Y QUE SE TRANSFORMEN EN ENTEROS LOS PARAMETROS
      //lo podremos ver en consola 
      transform:true, 
      transformOptions : {
        enableImplicitConversion : true ,
      }
    })
    );

  await app.listen(3000);
}
bootstrap();
