import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { LikeResolver } from './like.resolver'
import { LikeService } from './like.service'

describe('LikeResolver', () => {
  let resolver: LikeResolver

  beforeEach(async () => {
    class MockUser {
      constructor(public data?: any) {}
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeResolver,
        LikeService,
        {
          provide: getModelToken('Like'),
          useValue: new MockUser(),
        },
      ],
    }).compile()

    resolver = module.get<LikeResolver>(LikeResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
