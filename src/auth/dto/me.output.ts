import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Me {
  @Field(() => String)
  uuid: string

  @Field(() => String, { description: '닉네임' })
  nickName: string
}
