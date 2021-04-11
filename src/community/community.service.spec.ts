import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
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
        {
          provide: getModelToken('Community'),
          useValue: new MockUser(),
        },
      ],
    }).compile()

    service = module.get<CommunityService>(CommunityService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
