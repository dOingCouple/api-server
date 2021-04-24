import { getModelToken, getConnectionToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Tag } from '~/tag/schemas/tag.schema'
import { TagService } from '~/tag/tag.service'
import { CourseService } from './course.service'

describe('CourseService', () => {
  let service: CourseService

  beforeEach(async () => {
    class MockUser {
      constructor(public data?: any) {}
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<CourseService>(CourseService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
