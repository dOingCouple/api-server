import { ObjectType, Field } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document } from 'mongoose'
import { LikeType } from '~/common/constants'
import { BasePost } from '~/common/schemas/base-post.schema'
import { parseObjectId } from '~/common/utils/string'
import { User } from '~/user/schemas/user.schema'
import { CreateLikeInput } from '../dto/create-like.input'

export type LikeDocument = Like & Document

export const COLLECTION_NAME = 'likes'
@Schema({ collection: COLLECTION_NAME })
@ObjectType()
export class Like {
  @Field(() => String, { description: 'Like Type' })
  _id: Types.ObjectId

  @Prop({ required: true })
  @Field(() => LikeType, { description: 'Like Type' })
  likeType: LikeType

  @Prop({ type: Types.ObjectId })
  parentId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @Field(() => User, { description: '등록자' })
  registerUser: User | Types.ObjectId

  @Prop({ required: false })
  @Field(() => Date, { description: '등록날짜', defaultValue: new Date() })
  createdAt: Date

  public static createLike(user: User, createLike: CreateLikeInput): Like {
    return {
      parentId: parseObjectId(createLike.parentId),
      likeType: createLike.likeType,
      registerUser: user,
      createdAt: new Date(),
    } as Like
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like)
LikeSchema.index(
  { likeType: 1, parentId: 1, registerUser: 1 },
  { unique: true }
)
