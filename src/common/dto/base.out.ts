import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class BaseOut {
  @Field(() => Int)
  code: number

  @Field(() => String)
  message: string
}
