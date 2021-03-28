import { InputType, Field, PickType } from '@nestjs/graphql'
import { SignInInput } from './sign-in.input'

@InputType()
export class SignUpInput extends PickType(SignInInput, [
  'email',
  'provider',
] as const) {
  @Field(() => String, { description: '이름' })
  name: string

  @Field(() => String, { description: '닉네임' })
  nickName: string

  @Field(() => String, { description: '프로필 이미지 url' })
  profileImageUrl: string
}
