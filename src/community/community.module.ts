import { Module } from '@nestjs/common'
import { CommunityService } from './community.service'
import { CommunityResolver } from './community.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Community, CommunitySchema } from './schemas/community.schema'
import { TagModule } from '~/tag/tag.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Community.name,
        schema: CommunitySchema,
      },
    ]),
    TagModule,
  ],
  providers: [CommunityResolver, CommunityService],
})
export class CommunityModule {}
