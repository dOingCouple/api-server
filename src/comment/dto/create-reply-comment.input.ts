import { Field, InputType, OmitType } from '@nestjs/graphql'
import { CreateBaseCommentInput } from './create-base-comment.input'

@InputType()
export class CreateReplyCommentInput extends OmitType(
  CreateBaseCommentInput,
  []
) {
  @Field(() => String, { description: '코멘트 ID' })
  commentId: string
}
