import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationError } from 'class-validator';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { ValidationException } from './common/dtos/validation.exception';
import { formatValidationError } from './common/utils/error.utils';
import { ExistsConstraint } from './common/validators/exists.validator';
import { NotExistsConstraint } from './common/validators/not-exists.validator';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const logging = [];
        if (configService.get<boolean>('APP_DEBUG', false)) {
          logging.push('error');
          // logging.push('schema');
          // logging.push('query');
        }
        return {
          type: 'sqlite',
          database: configService.get<string>('DATABASE_NAME'),
          entities: [__dirname + '/../**/*.entity.js'],
          synchronize: configService.get<boolean>(
            'DANGEROUSLY_SYNCHRONIZE_DATABASE',
            false,
          ),
          logging: logging,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        disableErrorMessages: true,
        exceptionFactory: (exception: ValidationError[] = []) => {
          const errors = formatValidationError(exception);

          return new ValidationException(errors);
        },
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    ExistsConstraint,
    NotExistsConstraint,
  ],
})
export class AppModule {}
