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

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          autoSchemaFile: configService.get<string>('graphql.schemaFile'),
          playground: configService.get<boolean>('graphql.playground'),
          context: ({ req }) => ({ currentUser: req.user }),
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
    UserModule,
    CourseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
