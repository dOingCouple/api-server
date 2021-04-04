import { InputType, Field, PickType } from '@nestjs/graphql'
import { IsUrl, Matches, MaxLength, MinLength } from 'class-validator'
import { SignInInput } from './sign-in.input'

@InputType()
export class SignUpInput extends PickType(SignInInput, [
  'email',
  'provider',
] as const) {
  @MaxLength(50)
  @MinLength(1)
  @Field(() => String, { description: '이름' })
  name: string

  @MaxLength(10)
  @MinLength(2)
  @Matches(/^([\d\w가-힣ㄱ-ㅎㅏ-ㅣ]*)$/)
  @Field(() => String, { description: '닉네임' })
  nickName: string

  @IsUrl()
  @Field(() => String, { description: '프로필 이미지 url' })
  profileImageUrl: string
}
