import { InputType, Field, Int } from '@nestjs/graphql'
import { ArrayMaxSize, Length, Min } from 'class-validator'
import { PostType } from '~/common/constants'

@InputType()
export class CreateCourseInput {
  @Length(1, 100)
  @Field(() => String, { nullable: false, description: '제목' })
  title: string

  @Field(() => [String], {
    description: '커버 이미지 URL 리스트',
    defaultValue: [],
  })
  coverUrls: string[]

  @Field(() => Date, { nullable: false, description: '시작 날짜' })
  startedAt: Date

  @Min(0)
  @Field(() => Int, { nullable: false, description: '소요 시간(분)' })
  takeMinutes: number

  @Min(0)
  @Field(() => Int, { nullable: false, description: '소요 비용' })
  takeCharge: number

  @ArrayMaxSize(20)
  @Field(() => [String], {
    nullable: true,
    description: '태그 리스트',
    defaultValue: [],
  })
  tagNames: string[]
}
