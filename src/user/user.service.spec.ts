import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { get } from 'mongoose'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    class MockUser {
      constructor(public data?: any) {}
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: new MockUser(),
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', async () => {
    expect(service).toBeDefined()
  })
})
