import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import configEmail from './config/mail.config';
import { CacheModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import * as redisStore from 'cache-manager-ioredis';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as path from 'path';

import { AppController } from './app.controller';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { NotificationModule } from './notification/notification.module';
import { FtAuthModule } from './ft-auth/ft-auth.module';
import { AuthModule } from './auth/auth.module';
import { BestModule } from './best/best.module';
import { ReactionModule } from './reaction/reaction.module';
import { DatabaseModule } from './database/database.module';
import { getEnvPath } from './utils';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ormconfig } from './database/ormconfig';
import { FtCheckinModule } from './ft-checkin/ft-checkin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath(),
      isGlobal: true,
      cache: true,
      load: [ormconfig, configEmail],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ...config.get('email'),
          template: {
            dir: path.join(__dirname, '/views/ft-auth/'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    DatabaseModule.register(),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST ?? 'localhost',
      port: process.env.REDIS_PORT ?? 6379,
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('42world', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    CommentModule,
    UserModule,
    ArticleModule,
    CategoryModule,
    NotificationModule,
    FtAuthModule,
    AuthModule,
    BestModule,
    ReactionModule,
    FtCheckinModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
