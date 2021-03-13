import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Role } from '~/common/constants'
import { User } from '~/user/schemas/user.schema'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current.user'
import { Roles } from './decorators/roles.decorator'
import { Me } from './dto/me.out'
import { SignInInput } from './dto/sign-in.input'
import { SignInOutput } from './dto/sign-in.output'
import { SignUpInput } from './dto/sign-up.input'
import { GqlAuthGuard } from './guards/gql.guard'
import { RolesGuard } from './guards/role.guard'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInOutput, {
    description: '로그인',
  })
  signIn(@Args('signInInput') signInInput: SignInInput): Promise<SignInOutput> {
    return this.authService.signIn(signInInput)
  }

  @Mutation(() => Me, {
    description: '회원가입',
  })
  signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<Me> {
    return this.authService.signUp(signUpInput)
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Query(() => Me, {
    description: '자기 정보 가져오기',
  })
  me(@CurrentUser() user: User): Promise<Me> {
    return Promise.resolve({ nickName: user.nickName, uuid: user.uuid })
  }
}
