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

export enum PostType {
  COURSE = 1,
  COMMUNITY = 2,
}

registerEnumType(PostType, {
  name: 'PostType',
  description: '게시글 타입..',
})

export enum LikeType {
  COURSE = 1,
  COMMUNITY = 2,
  COMMENT = 3,
}

registerEnumType(LikeType, {
  name: 'LikeType',
  description: 'Like Type..',
})

export enum CommunityType {
  FREE = 1,
  WORRY = 2,
}

registerEnumType(CommunityType, {
  name: 'CommunityType',
  description: '커뮤니티 게시판 타입',
})
