import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from '~/user/schemas/user.schema'

export type CourseDocument = Course & Document

@Schema()
@ObjectType()
export class Course {
  @Prop({ required: true })
  @Field(() => String, { description: '제목' })
  title: string

  @Prop({ required: true })
  @Field(() => String, { description: '내용' })
  content: string

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

export const CourseSchema = SchemaFactory.createForClass(Course)
