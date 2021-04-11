import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Prop, Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { LikeType } from '~/common/constants'
import { User } from '~/user/schemas/user.schema'

@Schema()
@ObjectType()
export class Like {
  @Prop({ required: true })
  @Field(() => LikeType, { description: 'like 타입' })
  likeType: LikeType

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Field(() => User, { description: '등록자' })
  registerUser: User
}
