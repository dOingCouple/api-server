import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'
import { FileResolver } from './file.resolver'
import { FileService } from './file.service'

describe('FileResolver', () => {
  let resolver: FileResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileResolver,
        FileService,
        {
          provide: ConfigService,
          useValue: {
            get: (path: string) => ({
              configFilePath: join(
                __dirname,
                '../../test/resources/oracle.config'
              ),
            }),
          },
        },
      ],
    }).compile()

    resolver = module.get<FileResolver>(FileResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
