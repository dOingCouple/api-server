import { InputType, Field, Int, PartialType } from '@nestjs/graphql'
import { Provider } from '~/common/constants'

@InputType()
export class SignInInput {
  @Field(() => Int)
  id: number

  @Field(() => String)
  email: string

  @Field(() => Provider)
  provider: Provider
}
