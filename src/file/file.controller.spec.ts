import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { RedisModule } from 'nestjs-redis'
import { join } from 'path'
import { AuthService } from '~/auth/auth.service'
import { UserService } from '~/user/user.service'
import { FileController } from './file.controller'
import { FileService } from './file.service'

describe('FileController', () => {
  let controller: FileController

  beforeEach(async () => {
    class MockUser {
      constructor(public data?: any) {}
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              secret: configService.get<string>('jwt.secret'),
              signOptions: {
                expiresIn: configService.get<string>('jwt.expiresIn'),
              },
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
      ],
      providers: [
        FileService,
        AuthService,
        UserService,
        {
          provide: ConfigService,
          useValue: {
            get: (path: string) => ({
              configFilePath: join(
                __dirname,
                '../../test/resources/oracle.config'
              ),
            }),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: new MockUser(),
        },
      ],
    }).compile()

    controller = module.get<FileController>(FileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
