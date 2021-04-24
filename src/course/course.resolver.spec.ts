import { getConnectionToken, getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Tag } from '~/tag/schemas/tag.schema'
import { TagService } from '~/tag/tag.service'
import { CourseResolver } from './course.resolver'
import { CourseService } from './course.service'

describe('CourseResolver', () => {
  let resolver: CourseResolver

  beforeEach(async () => {
    class MockUser {
      constructor(public data?: any) {}
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseResolver,
        CourseService,
        TagService,
        {
          provide: getModelToken('Course'),
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

    resolver = module.get<CourseResolver>(CourseResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
