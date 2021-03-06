import { ObjectType, Field } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document } from 'mongoose'

export type TagDocument = Tag & Document

@Schema()
@ObjectType()
export class Tag {
  @Field(() => String, { description: 'Tag ID' })
  _id: Types.ObjectId

  @Prop({ unique: true })
  @Field(() => String, { description: 'Tag 이름' })
  name: string

  @Prop()
  createdAt: Date

  public static createTag(name: string): Tag {
    return {
      name,
      createdAt: new Date(),
    } as Tag
  }
}

export const TagSchema = SchemaFactory.createForClass(Tag)
