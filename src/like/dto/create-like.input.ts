import { InputType, Field } from '@nestjs/graphql'
import { LikeType } from '~/common/constants'

@InputType()
export class CreateLikeInput {
  @Field(() => LikeType, { description: 'Like Type' })
  likeType: LikeType

  @Field(() => String, { description: '부모 ID' })
  parentId: string
}
