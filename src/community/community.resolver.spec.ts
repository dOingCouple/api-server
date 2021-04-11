import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { CommunityResolver } from './community.resolver'
import { CommunityService } from './community.service'

describe('CommunityResolver', () => {
  let resolver: CommunityResolver

  beforeEach(async () => {
    class MockUser {
      constructor(public data?: any) {}
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityResolver,
        CommunityService,
        {
          provide: getModelToken('Community'),
          useValue: new MockUser(),
        },
      ],
    }).compile()

    resolver = module.get<CommunityResolver>(CommunityResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
