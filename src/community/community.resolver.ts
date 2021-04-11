import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { CommunityService } from './community.service'
import { Community } from './schemas/community.schema'
import { CreateCommunityInput } from './dto/create-community.input'
import { GqlAuthGuard } from '~/auth/guards/gql.guard'
import { UseGuards } from '@nestjs/common'
import { CurrentUser } from '~/auth/decorators/current.user'
import { User } from '~/user/schemas/user.schema'

@Resolver(() => Community)
export class CommunityResolver {
  constructor(private readonly communityService: CommunityService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Community)
  createCommunity(
    @Args('createCommunityInput') createCommunityInput: CreateCommunityInput,
    @CurrentUser() user: User
  ) {
    return this.communityService.create(user, createCommunityInput)
  }

  @Query(() => [Community], { name: 'community' })
  findAll() {
    return this.communityService.findAll()
  }

  @Query(() => Community, { name: 'community' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.communityService.findOne(id)
  }
}
