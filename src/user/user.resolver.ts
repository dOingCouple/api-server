import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from './schemas/user.schema'
import { UpdateUserInput } from './dto/update-user.input'
import { AuthGuard } from '~/auth/guards/auth.guard'
import { UseGuards } from '@nestjs/common'
import { CurrentUser } from '~/auth/decorators/current.user'
import { GqlAuthGuard } from '~/auth/guards/gql.guard'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'users' })
  findAll(@CurrentUser() fff: any): Promise<User[]> {
    return this.userService.findAll()
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id)
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput)
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id)
  }
}
