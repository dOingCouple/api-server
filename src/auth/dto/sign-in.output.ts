import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { BaseOut } from '~/common/dto/base.out'

@ObjectType()
export class SignInOutput {
  @Field(() => String, { description: 'jwt token' })
  accessToken: string
}
