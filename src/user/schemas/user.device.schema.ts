import { ObjectType, Field } from '@nestjs/graphql'
import { Prop } from '@nestjs/mongoose'
import { OS } from '~/common/constants'

@ObjectType()
export class Device {
  @Prop({ required: true })
  @Field(() => OS, { description: 'Ios/Android' })
  os: OS

  @Prop({ required: true })
  @Field(() => String, { description: '기기 정보' })
  name: string

  @Prop({ required: true })
  @Field(() => String, { description: '버전 정보' })
  version: string
}
