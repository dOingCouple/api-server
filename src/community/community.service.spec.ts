import { getConnectionToken, getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Tag } from '~/tag/schemas/tag.schema'
import { TagService } from '~/tag/tag.service'
import { CommunityService } from './community.service'

describe('CommunityService', () => {
  let service: CommunityService

  beforeEach(async () => {
    class MockUser {
      constructor(public data?: any) {}
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
        {
          provide: getConnectionToken('Database'),
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<CommunityService>(CommunityService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
