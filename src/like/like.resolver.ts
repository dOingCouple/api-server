import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { LikeService } from './like.service'
import { Like } from './schemas/like.scheme'
import { CreateLikeInput } from './dto/create-like.input'
import { GqlAuthGuard } from '~/auth/guards/gql.guard'
import { UseGuards } from '@nestjs/common'
import { User } from '~/user/schemas/user.schema'
import { CurrentUser } from '~/auth/decorators/current.user'

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  createLike(
    @Args('createLikeInput') createLikeInput: CreateLikeInput,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.likeService.create(user, createLikeInput)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  removeLike(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User
  ) {
    return this.likeService.remove(user, id)
  }
}
