import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Length } from 'class-validator'
import { Document } from 'mongoose'
import { CommunityType, PostType } from '~/common/constants'
import { BasePost } from '~/common/schemas/base-post.schema'
import { User } from '~/user/schemas/user.schema'
import { CreateCommunityInput } from '../dto/create-community.input'

export type CommunityDocument = Community & Document

@Schema()
@ObjectType()
export class Community extends BasePost {
  @Prop({ required: true })
  @Length(1, 500)
  @Field(() => String, { nullable: false, description: '게시글 내용' })
  content: string

  @Prop({ required: true })
  @Field(() => CommunityType, { nullable: false, description: '게시글 타입' })
  communityType: CommunityType

  @Prop({ required: true })
  @Field(() => [String], {
    nullable: true,
    description: '게시글 이미지 URL 리스트',
    defaultValue: [],
  })
  imageUrls: string[] = []

  public static createCommunity(
    user: User,
    createCommunity: CreateCommunityInput
  ): Community {
    return {
      ...createCommunity,
      postType: PostType.COMMUNITY,
      registerUser: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Community
  }
}

export const CommunitySchema = SchemaFactory.createForClass(Community)
