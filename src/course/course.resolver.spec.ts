import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
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
        {
          provide: getModelToken('Course'),
          useValue: new MockUser(),
        },
      ],
    }).compile()

    resolver = module.get<CourseResolver>(CourseResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
