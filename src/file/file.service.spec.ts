import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'
import { FileService } from './file.service'

describe('FileService', () => {
  let service: FileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<FileService>(FileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
