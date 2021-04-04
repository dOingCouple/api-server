import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from './schemas/user.schema'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '~/auth/guards/gql.guard'
import { PaginationArgs } from '~/common/dto/page-pagination.args'
import { PaginatedUser } from './dto/paginated-user.output'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedUser, { name: 'users' })
  findAll(@Args() args: PaginationArgs): Promise<PaginatedUser> {
    return this.userService.findAll(args)
  }
}
