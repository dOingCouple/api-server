import { ObjectType, Field } from '@nestjs/graphql'
import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { User } from '~/user/schemas/user.schema'
import { Like } from '~/like/schemas/like.scheme'

@Schema()
@ObjectType()
export class BaseComment {
  _id: Types.ObjectId

  @Prop({ required: true })
  @Field(() => String, { description: '댓글 내용' })
  content: string

  @Prop({ type: [{ type: Types.ObjectId, ref: Like.name }] })
  @Field(() => [Like], { description: 'like 리스트' })
  likes: Like[]

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @Field(() => User, { description: '대상자' })
  targetUser: User

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @Field(() => User, { description: '등록자' })
  registerUser: User

  @Prop({ required: false })
  @Field(() => Date, { description: '등록날짜', defaultValue: new Date() })
  createdAt: Date

  @Prop({ required: false })
  @Field(() => Date, { description: '수정날짜', defaultValue: new Date() })
  updatedAt: Date
}
