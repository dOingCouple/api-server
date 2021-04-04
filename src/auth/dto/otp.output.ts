import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class OtpOutput {
  @Field(() => String, { description: '일회용 비밀번호' })
  value: string
}
