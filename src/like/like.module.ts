import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Like, LikeSchema } from './schemas/like.scheme'
import { LikeService } from './like.service'
import { LikeResolver } from './like.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Like.name,
        schema: LikeSchema,
      },
    ]),
  ],
  providers: [LikeResolver, LikeService],
})
export class LikeModule {}
