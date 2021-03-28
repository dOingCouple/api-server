import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FileListOut {
  @Field(() => String, { description: '내용물' })
  content: string
}
