import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { from } from 'rxjs'
import { RestCurrentUser } from '~/auth/decorators/current.user'
import { RestGuard } from '~/auth/guards/rest.guard'
import { User } from '~/user/schemas/user.schema'
import { FileService } from './file.service'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(RestGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fileSize: 1024000000,
      },
    })
  )
  upload(
    @RestCurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File
  ) {
    return from(this.fileService.uploadObject(file, user.uuid)).toPromise()
  }
}
