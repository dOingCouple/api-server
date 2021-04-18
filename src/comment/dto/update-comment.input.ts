import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class UpdateCommentInput {
  @Field(() => String, { defaultValue: '댓글 수정할 ID' })
  commentId: string

  @Field(() => String, { description: '댓글 수정 내용' })
  content: string
}
