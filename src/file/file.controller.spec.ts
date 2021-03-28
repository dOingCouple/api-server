import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { join } from 'path'
import { FileController } from './file.controller'
import { FileService } from './file.service'

describe('FileController', () => {
  let controller: FileController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
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

    controller = module.get<FileController>(FileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
