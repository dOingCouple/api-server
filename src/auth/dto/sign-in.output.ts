import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { BaseOut } from '~/common/dto/base.output'

@ObjectType()
export class SignInOutput {
  @Field(() => String, { description: 'jwt token' })
  accessToken: string
}
