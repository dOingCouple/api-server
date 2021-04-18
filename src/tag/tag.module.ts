import { Module } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagResolver } from './tag.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Tag, TagSchema } from './schemas/tag.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tag.name,
        schema: TagSchema,
      },
    ]),
  ],
  providers: [TagResolver, TagService],
  exports: [TagService],
})
export class TagModule {}
