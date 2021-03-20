import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { RedisModule } from 'nestjs-redis'
import { UserModule } from '~/user/user.module'
import { UserService } from '~/user/user.service'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

describe('AuthResolver', () => {
  let resolver: AuthResolver

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
        AuthResolver,
        AuthService,
        UserService,
        {
          provide: getModelToken('User'),
          useValue: new MockUser(),
        },
      ],
    }).compile()

    resolver = module.get<AuthResolver>(AuthResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
