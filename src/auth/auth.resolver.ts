import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { BaseOut } from '~/common/dto/base.out'
import { User } from '~/user/schemas/user.schema'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current.user'
import { Me } from './dto/me.out'
import { SignInInput } from './dto/sign-in.input'
import { SignUpInput } from './dto/sign-up.input'
import { GqlAuthGuard } from './guards/gql.guard'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => BaseOut, {
    description: '로그인',
  })
  signIn(@Args('signInInput') signInInput: SignInInput): Promise<BaseOut> {
    return Promise.resolve({
      code: 11,
      message: '123123',
    })
  }

  @Mutation(() => BaseOut, {
    description: '회원가입',
  })
  signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<BaseOut> {
    return Promise.resolve({
      code: 11,
      message: '123123',
    })
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Me, {
    description: '자기 정보 가져오기',
  })
  me(@CurrentUser() user: User): Promise<Me> {
    return Promise.resolve({ ...user })
  }
}
