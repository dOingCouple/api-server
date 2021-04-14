import { InputType } from '@nestjs/graphql'
import { CreateBaseCommentInput } from './create-base-comment.input'

@InputType()
export class CreateCommentInput extends CreateBaseCommentInput {}
