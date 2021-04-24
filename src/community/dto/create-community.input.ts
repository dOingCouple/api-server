import { InputType, Field } from '@nestjs/graphql'
import { Length, ArrayMaxSize } from 'class-validator'
import { CommunityType } from '~/common/constants'

@InputType()
export class CreateCommunityInput {
  @Length(1, 500)
  @Field(() => String, { nullable: false, description: '게시글 내용' })
  content: string

  @Field(() => CommunityType, { nullable: false, description: '게시글 타입' })
  communityType: CommunityType

  @Field(() => [String], {
    nullable: true,
    description: '게시글 이미지 URL 리스트',
    defaultValue: [],
  })
  imageUrls: string[]

  @ArrayMaxSize(20)
  @Field(() => [String], {
    nullable: true,
    description: '태그 리스트',
    defaultValue: [],
  })
  tagNames: string[]
}
