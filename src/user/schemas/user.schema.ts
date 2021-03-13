import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Provider, Role } from '~/common/constants'

export type UserDocument = User & Document

@Schema()
@ObjectType()
export class User {
  @Prop({ required: true, unique: true })
  @Field(() => String, { description: 'uuid' })
  uuid: string

  @Prop({ required: true })
  @Field(() => String, { description: '이름' })
  name: string

  @Prop({ required: true, unique: true })
  @Field(() => String, { description: '닉네임' })
  nickName: string

  @Prop({ required: true })
  @Field(() => String, { description: '이메일' })
  email: string

  @Prop({ required: false })
  @Field(() => String, { description: '프로필 이미지 url' })
  photoUrl: string

  @Prop({ required: true })
  @Field(() => Provider, { description: 'provider' })
  provider: Provider

  @Prop({ required: true })
  @Field(() => Role, { description: '권한', defaultValue: Role.USER })
  role: Role

  @Prop({ required: false })
  @Field(() => Date, { description: '등록날짜', defaultValue: new Date() })
  createdAt: Date

  @Prop({ required: false })
  @Field(() => Date, { description: '수정날짜', defaultValue: new Date() })
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
