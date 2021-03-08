import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreateCourseInput {
  @Field(() => String, { description: '제목' })
  title: string

  @Field(() => String, { description: '내용' })
  content: string
}
