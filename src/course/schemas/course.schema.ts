import { ObjectType, Field } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BasePost } from '~/common/schemas/base-post.schema'
import { User } from '~/user/schemas/user.schema'
import { CreateCourseInput } from '~/course/dto/create-course.input'
import { PostType } from '~/common/constants'

export type CourseDocument = Course & Document

@Schema()
@ObjectType()
export class Course extends BasePost {
  @Prop({ required: true })
  @Field(() => String, { description: '제목' })
  title: string

  @Prop({ required: true })
  @Field(() => [String], { description: '커버 이미지 URL 리스트' })
  coverUrls: string[]

  @Prop({ required: true })
  @Field(() => Date, { description: '시작 날짜' })
  startedAt: Date

  @Prop({ required: true })
  @Field(() => String, { description: '소요 시간(분)' })
  takeMinutes: number

  @Prop({ required: true })
  @Field(() => String, { description: '소요 비용' })
  takeCharge: number

  public static createCourse(
    user: User,
    createCourseInput: CreateCourseInput
  ): Course {
    return {
      ...createCourseInput,
      postType: PostType.COURSE,
      registerUser: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Course
  }
}

export const CourseSchema = SchemaFactory.createForClass(Course)
