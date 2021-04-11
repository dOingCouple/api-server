import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { LikeService } from './like.service'
import { Like } from './schemas/like.scheme'
import { CreateLikeInput } from './dto/create-like.input'
import { GqlAuthGuard } from '~/auth/guards/gql.guard'
import { UseGuards } from '@nestjs/common'
import { User } from '~/user/schemas/user.schema'
import { CurrentUser } from '~/auth/decorators/current.user'
import { VoidScalar } from '~/common/scalars/void.scalar'

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VoidScalar, { nullable: true })
  createLike(
    @Args('createLikeInput') createLikeInput: CreateLikeInput,
    @CurrentUser() user: User
  ): Promise<null> {
    return this.likeService.create(user, createLikeInput)
  }

  @Query(() => [Like], { name: 'like' })
  findAll() {
    return this.likeService.findAll()
  }

  @Query(() => Like, { name: 'like' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.likeService.findOne(id)
  }

  @Mutation(() => Like)
  removeLike(@Args('id', { type: () => Int }) id: number) {
    return this.likeService.remove(id)
  }
}
