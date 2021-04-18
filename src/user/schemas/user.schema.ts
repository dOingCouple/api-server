import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { SignUpInput } from '~/auth/dto/sign-up.input'
import { Provider, Role } from '~/common/constants'
import { v4 as uuid } from 'uuid'

export type UserDocument = User & Document

@Schema()
@ObjectType()
export class User {
  _id: Types.ObjectId

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
  profileImageUrl: string

  @Prop({ required: true })
  @Field(() => Provider, { description: 'provider' })
  provider: Provider

  @Prop({ required: true, default: Role.USER })
  @Field(() => Role, { description: '권한', defaultValue: Role.USER })
  role: Role

  @Prop({ required: false })
  @Field(() => Date, { description: '등록날짜', defaultValue: new Date() })
  createdAt: Date

  @Prop({ required: false })
  @Field(() => Date, { description: '수정날짜', defaultValue: new Date() })
  updatedAt: Date

  public static createUser(signUpInput: SignUpInput): User {
    return {
      uuid: uuid(),
      ...signUpInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User
  }
}

export const UserSchema = SchemaFactory.createForClass(User)
