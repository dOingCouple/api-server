import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ExistNickNameInput {
  @Field(() => String, { description: '닉네임' })
  nickName: string
}
