import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // allowing all for our demo app
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Task manager API')
    .setDescription('The task manager description')
    .setVersion('1.0')
    .addTag('task')
    .addTag('task')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = process.env.PORT || 5000;
  await app.listen(port, () => {
    console.log(' ********************* server up  *********************');
  });
}
bootstrap();
