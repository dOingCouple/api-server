import { ArgsType, Field, Int } from '@nestjs/graphql'

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: false, defaultValue: 10 })
  next = 10

  @Field(() => String, { nullable: true })
  after?: string

  @Field(() => String, { nullable: true })
  before?: string
}
