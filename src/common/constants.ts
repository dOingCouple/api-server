import { registerEnumType } from '@nestjs/graphql'

export enum Provider {
  GOOGLE = 'google',
  KAKAO = 'kakao',
}

registerEnumType(Provider, {
  name: 'Provider',
  description: '회원가입시 provider',
})
