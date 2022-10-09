import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // allowing all for our demo app
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = process.env.PORT || 5000;
  await app.listen(port, () => {
    console.log(' ********************* server up  *********************');
  });
}
bootstrap();
