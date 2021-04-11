import { CreateCommunityInput } from './create-community.input'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateCommunityInput extends PartialType(CreateCommunityInput) {
  @Field(() => Int)
  id: number
}
