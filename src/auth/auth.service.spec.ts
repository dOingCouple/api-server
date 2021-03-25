import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { RedisModule } from 'nestjs-redis'
import { UserModule } from '~/user/user.module'
import { UserService } from '~/user/user.service'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    class MockUser {
      constructor(public data?: any) {}
    }
    const module: TestingModule = await Test.createTestingModule({
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
        AuthService,
        UserService,
        ConfigService,
        {
          provide: getModelToken('User'),
          useValue: new MockUser(),
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should be get session key', () => {
    expect(service.getSessionKey('HAHA')).toEqual('SESSION:HAHA')
  })
})
