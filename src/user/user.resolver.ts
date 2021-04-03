import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from './schemas/user.schema'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '~/auth/guards/gql.guard'
import { PaginationArgs } from '~/common/dto/page-pagination.args'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'users' })
  findAll(@Args() args: PaginationArgs): Promise<User[]> {
    return this.userService.findAll(args)
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id)
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id)
  }
}
