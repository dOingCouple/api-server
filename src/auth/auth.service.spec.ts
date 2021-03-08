import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
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
      ],
      providers: [
        AuthService,
        UserService,
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
})
