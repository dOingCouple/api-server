import { Test, TestingModule } from '@nestjs/testing'
import { getConnectionToken, getModelToken } from '@nestjs/mongoose'
import { CommentResolver } from './comment.resolver'
import { CommentService } from './comment.service'

describe('CommentResolver', () => {
  let resolver: CommentResolver

  beforeEach(async () => {
    class MockUser {
      constructor(public data?: any) {}
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentResolver,
        CommentService,
        {
          provide: getModelToken('Comment'),
          useValue: new MockUser(),
        },
        {
          provide: getConnectionToken('Database'),
          useValue: {},
        },
      ],
    }).compile()

    resolver = module.get<CommentResolver>(CommentResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
