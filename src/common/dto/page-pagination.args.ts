import { ArgsType, Field, Int } from '@nestjs/graphql'
import { Max, Min } from 'class-validator'

@ArgsType()
export class PaginationArgs {
  @Max(50)
  @Min(10)
  @Field(() => Int, { nullable: false, defaultValue: 10 })
  next = 10

  @Field(() => String, { nullable: true })
  after?: string

  @Field(() => String, { nullable: true })
  before?: string
}
