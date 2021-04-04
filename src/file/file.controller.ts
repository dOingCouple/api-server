import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { from } from 'rxjs'
import { OtpGuard } from '~/auth/guards/otp.guard'
import { FileService } from './file.service'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(OtpGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fileSize: 1024000000,
      },
    })
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return from(this.fileService.uploadObject(file)).toPromise()
  }
}
