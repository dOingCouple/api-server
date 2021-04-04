import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ExistNickNameOutput {
  @Field(() => Boolean, { description: '닉네임 존재 여부' })
  exist: boolean
}
