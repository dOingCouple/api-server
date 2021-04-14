import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { CommentService } from './comment.service'
import { Comment } from './schemas/comment.schema'
import { CreateCommentInput } from './dto/create-comment.input'
import { UpdateCommentInput } from './dto/update-comment.input'
import { CreateReplyCommentInput } from './dto/create-reply-comment.input'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '~/auth/guards/gql.guard'
import { CurrentUser } from '~/auth/decorators/current.user'
import { User } from '~/user/schemas/user.schema'

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { description: '댓글 작성' })
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() user: User
  ): Promise<boolean> {
    return this.commentService.create(user, createCommentInput)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment, { description: '대댓글 작성' })
  createReplyComment(
    @Args('createReplyCommentInput')
    createReplyCommentInput: CreateReplyCommentInput,
    @CurrentUser() user: User
  ) {
    return this.commentService.createReply(user, createReplyCommentInput)
  }

  @Query(() => [Comment], { name: 'comments', description: '댓글 조회' })
  findAll(@Args('uuid') uuid: string) {
    return this.commentService.findAll()
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() user: User
  ) {
    return this.commentService.update(
      user,
      updateCommentInput.id,
      updateCommentInput
    )
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  removeComment(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User
  ) {
    return this.commentService.remove(user, id)
  }
}
