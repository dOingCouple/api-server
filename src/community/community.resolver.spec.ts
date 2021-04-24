import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Tag } from '~/tag/schemas/tag.schema'
import { TagService } from '~/tag/tag.service'
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
        TagService,
        {
          provide: getModelToken('Community'),
          useValue: new MockUser(),
        },
        {
          provide: getModelToken(Tag.name),
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
