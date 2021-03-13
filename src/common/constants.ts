import { registerEnumType } from '@nestjs/graphql'

export enum Provider {
  GOOGLE = 'google',
  KAKAO = 'kakao',
}

registerEnumType(Provider, {
  name: 'Provider',
  description: '회원가입시 provider',
})

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

registerEnumType(Role, {
  name: 'Role',
  description: '권한',
})

export enum OS {
  IOS = 'ios',
  ANDROID = 'android',
}

registerEnumType(OS, {
  name: 'OS',
  description: '운영체제',
})
