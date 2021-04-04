import { InputType, Field } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import { Provider } from '~/common/constants'
import { SignInDeviceInput } from './sign-in.device.input'

@InputType()
export class SignInInput {
  @IsEmail()
  @Field(() => String)
  email: string

  @Field(() => Provider)
  provider: Provider

  @Field(() => SignInDeviceInput, { description: '장비 정보', nullable: true })
  device: SignInDeviceInput
}
