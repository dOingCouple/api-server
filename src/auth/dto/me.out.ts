import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Me {
  @Field(() => String)
  uuid: string
}
