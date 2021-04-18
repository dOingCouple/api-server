import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { TagResolver } from './tag.resolver'
import { TagService } from './tag.service'
import { Tag } from './schemas/tag.schema'

describe('TagResolver', () => {
  let resolver: TagResolver

  beforeEach(async () => {
    class MockTag {
      constructor(public data?: any) {}
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagResolver,
        TagService,
        {
          provide: getModelToken(Tag.name),
          useValue: new MockTag(),
        },
      ],
    }).compile()

    resolver = module.get<TagResolver>(TagResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
