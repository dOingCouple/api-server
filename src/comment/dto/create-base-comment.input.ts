import { InputType, Field } from '@nestjs/graphql'
import { ParentType } from '~/common/constants'

@InputType()
export class CreateBaseCommentInput {
  @Field(() => String, { description: '부모 ID' })
  parentId: string

  @Field(() => ParentType, { description: '부모 타입' })
  parentType: ParentType

  @Field(() => String, { description: '댓글 내용' })
  content: string
}
