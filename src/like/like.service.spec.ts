import { getConnectionToken, getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mongoose'
import { LikeService } from './like.service'

describe('LikeService', () => {
  let service: LikeService

  beforeEach(async () => {
    class MockUser {
      constructor(public data?: any) {}
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: getModelToken('Like'),
          useValue: new MockUser(),
        },
        {
          provide: getConnectionToken('Database'),
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<LikeService>(LikeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
