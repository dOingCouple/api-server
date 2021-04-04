import { Module } from '@nestjs/common'
import { FileService } from './file.service'
import { FileResolver } from './file.resolver'
import { FileController } from './file.controller'
import { AuthModule } from '~/auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [FileResolver, FileService],
  controllers: [FileController],
})
export class FileModule {}
