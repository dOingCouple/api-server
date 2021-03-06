import { InputType, Field } from '@nestjs/graphql'
import { Provider } from '~/common/constants'

@InputType()
export class SignupInput {
  @Field(() => String, { description: '사용자 이름' })
  name: string

  @Field(() => String, { description: '사용자 이메일' })
  email: string

  @Field(() => String, { description: '사용자 프로필 이미지 url' })
  photoUrl: string

  @Field(() => Provider, { description: '회원가입 provider' })
  provider: Provider
}
