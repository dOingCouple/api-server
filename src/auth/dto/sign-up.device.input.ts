import { Field, InputType } from '@nestjs/graphql'
import { Prop } from '@nestjs/mongoose'
import { OS } from '~/common/constants'

@InputType()
export class SignUpDeviceInput {
  @Prop({ required: true })
  @Field(() => OS, { description: 'Ios/Android' })
  os: OS

  @Prop({ required: true })
  @Field(() => String, { description: '기기 정보' })
  model: string

  @Prop({ required: true })
  @Field(() => String, { description: '버전 정보' })
  version: string
}
