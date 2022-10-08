import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
