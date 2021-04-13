import { InputType, Field } from '@nestjs/graphql'
import { ParentType } from '~/common/constants'

@InputType()
export class CreateLikeInput {
  @Field(() => ParentType, { description: 'Parent Type' })
  parentType: ParentType

  @Field(() => String, { description: '부모 ID' })
  parentId: string
}
