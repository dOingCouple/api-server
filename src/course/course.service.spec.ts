import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
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
        {
          provide: getModelToken('Course'),
          useValue: new MockUser(),
        },
      ],
    }).compile()

    service = module.get<CourseService>(CourseService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
