import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { flatMap, map } from 'rxjs/internal/operators'
import { findModelName } from '~/common/utils/like.enum'
import { findOneBasePost } from '~/common/utils/mongo'
import { User } from '~/user/schemas/user.schema'
import { CreateCommentInput } from './dto/create-comment.input'
import { CreateReplyCommentInput } from './dto/create-reply-comment.input'
import { UpdateCommentInput } from './dto/update-comment.input'
import { Comment, CommentDocument } from './schemas/comment.schema'

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectConnection() private connection: Connection
  ) {}

  create(user: User, createCommentInput: CreateCommentInput): Promise<boolean> {
    return findOneBasePost(
      this.connection,
      createCommentInput.parentType,
      createCommentInput.parentId
    )
      .pipe(
        flatMap(() =>
          this.commentModel.create(
            Comment.createComment(user, createCommentInput)
          )
        ),
        flatMap((comment: Comment) => {
          return this.connection
            .model(findModelName(createCommentInput.parentType))
            .updateOne(
              {
                _id: createCommentInput.parentId,
              },
              {
                $push: {
                  comments: comment._id,
                },
              }
            )
            .exec()
        }),
        map((data) => data.ok === 1)
      )
      .toPromise()
  }

  createReply(user: User, createReplyCommentInput: CreateReplyCommentInput) {
    return ''
  }

  findAll() {
    return `This action returns all comment`
  }

  update(user: User, id: number, updateCommentInput: UpdateCommentInput) {
    return `This action updates a #${id} comment`
  }

  remove(user: User, id: number) {
    return `This action removes a #${id} comment`
  }
}
