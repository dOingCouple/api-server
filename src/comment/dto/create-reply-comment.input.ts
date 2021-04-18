import { Field, InputType, OmitType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateBaseCommentInput } from './create-base-comment.input'

@InputType()
export class CreateReplyCommentInput extends OmitType(CreateBaseCommentInput, [
  'parentId',
  'parentType',
]) {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: '코멘트 ID' })
  commentId: string
}
