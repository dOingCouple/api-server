import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from '~/app.controller'
import { AppService } from '~/app.service'
import { UserModule } from '~/user/user.module'
import configuration from '~/config/configuration'
import { validate } from '~/config/env.validation'
import { CourseModule } from './course/course.module'
import { AuthModule } from './auth/auth.module'
import { GraphQLError } from 'graphql'
import { RedisModule } from 'nestjs-redis/dist/redis.module'
import { Environment } from './config/types/env.types'
import { FileModule } from './file/file.module'
import { MapController } from './map/map.controller'
import { LikeModule } from './like/like.module'
import { CommunityModule } from './community/community.module'
import { VoidScalar } from './common/scalars/void.scalar'

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          autoSchemaFile: configService.get<string>('graphql.schemaFile'),
          playground: configService.get<boolean>('graphql.playground'),
          context: ({ req }) => ({ currentUser: req.user }),
          formatError: (error: GraphQLError) => {
            return configService.get('NODE_ENV') === Environment.Local
              ? error
              : {
                  message:
                    error.extensions.exception.response.message ||
                    error.message,
                  code: error.extensions.exception.status,
                }
          },
          installSubscriptionHandlers: true,
        }
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('mongo.uri'),
          auth: {
            user: configService.get<string>('mongo.user'),
            password: configService.get<string>('mongo.password'),
          },
          useCreateIndex: true,
        }
      },
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    CourseModule,
    AuthModule,
    FileModule,
    LikeModule,
    CommunityModule,
  ],
  controllers: [AppController, MapController],
  providers: [AppService, VoidScalar],
})
export class AppModule {}
