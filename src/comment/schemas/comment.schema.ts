import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Length } from 'class-validator'
import { Types, Document, ObjectId } from 'mongoose'
import { ParentType } from '~/common/constants'
import { Like } from '~/like/schemas/like.scheme'
import { User } from '~/user/schemas/user.schema'
import { CreateCommentInput } from '../dto/create-comment.input'
import { CreateReplyCommentInput } from '../dto/create-reply-comment.input'

export type CommentDocument = Comment & Document

@Schema()
@ObjectType()
export class Comment {
  @Field(() => String, { description: '댓글 ID' })
  _id: Types.ObjectId

  @Prop()
  @Field(() => String, { description: '부모 ID' })
  parentId: string

  @Prop()
  @Field(() => ParentType, { description: '부모 타입' })
  parentType: ParentType

  @Length(1, 500)
  @Prop({ required: true })
  @Field(() => String, { description: '댓글 내용' })
  content: string

  @Prop({ type: [{ type: Types.ObjectId, ref: Like.name, default: [] }] })
  @Field(() => [Like], { description: 'like 리스트', defaultValue: [] })
  likes: Like[] = []

  @Prop({ type: [{ type: Types.ObjectId, ref: Comment.name, default: [] }] })
  @Field(() => [Comment], { description: '코멘트 리스트', defaultValue: [] })
  replyComments: Comment[] | Types.ObjectId[] = []

  @Prop({ type: Types.ObjectId, ref: User.name, required: false })
  @Field(() => User, { description: '대상자', nullable: true })
  targetUser?: User

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @Field(() => User, { description: '등록자' })
  registerUser: User | Types.ObjectId

  @Prop({ type: Boolean, required: false })
  delete = false

  @Prop({ required: false })
  @Field(() => Date, { description: '등록날짜', defaultValue: new Date() })
  createdAt: Date

  @Prop({ required: false })
  @Field(() => Date, { description: '수정날짜', defaultValue: new Date() })
  updatedAt: Date

  public static createComment(
    user: User,
    createComment: CreateCommentInput
  ): Comment {
    return {
      ...createComment,
      registerUser: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Comment
  }

  public static createReplyComment(
    user: User,
    targetComment: Comment,
    createReplyComment: CreateReplyCommentInput
  ): Comment {
    return {
      parentId: targetComment.parentId,
      parentType: targetComment.parentType,
      content: createReplyComment.content,
      registerUser: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Comment
  }

  public static isObjectIdInRegisterUser(
    objectId: any
  ): objectId is Types.ObjectId {
    return objectId instanceof Types.ObjectId
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
