import { ObjectType, Field } from '@nestjs/graphql'
import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { User } from '~/user/schemas/user.schema'
import { PostType } from '~/common/constants'

@Schema()
@ObjectType()
export class BasePost {
  @Prop({ required: true })
  @Field(() => PostType, { description: '게시글 타입' })
  postType: PostType

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => User, { description: '등록자' })
  registerUser: User

  @Prop({ required: false })
  @Field(() => Date, { description: '등록날짜', defaultValue: new Date() })
  createdAt: Date

  @Prop({ required: false })
  @Field(() => Date, { description: '수정날짜', defaultValue: new Date() })
  updatedAt: Date
}
