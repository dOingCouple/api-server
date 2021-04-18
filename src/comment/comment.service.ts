import { HttpException, Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model, Types } from 'mongoose'
import { from, of, throwError } from 'rxjs'
import { flatMap, map, switchMap } from 'rxjs/internal/operators'
import { ErrorType } from '~/common/error.type'
import { notFoundData } from '~/common/operators'
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
    return from(
      this.commentModel.findOne({ _id: createReplyCommentInput.commentId })
    )
      .pipe(
        notFoundData(
          `not found comment, commentId: ${createReplyCommentInput.commentId}`
        ),
        switchMap((targetComment: Comment) =>
          from(
            this.commentModel.create(
              Comment.createReplyComment(
                user,
                targetComment,
                createReplyCommentInput
              )
            )
          ).pipe(
            flatMap((replyComment) =>
              this.commentModel
                .updateOne(
                  {
                    _id: createReplyCommentInput.commentId,
                  },
                  {
                    $push: {
                      replyComments: replyComment._id,
                    },
                  }
                )
                .exec()
            )
          )
        ),
        map((res) => res.ok === 1)
      )
      .toPromise()
  }

  findAll() {
    throw new HttpException('undeveloped api', ErrorType.UN_DEVELOPED)
  }

  update(user: User, updateCommentInput: UpdateCommentInput) {
    return from(
      this.commentModel.findOne({ _id: updateCommentInput.commentId })
    )
      .pipe(
        notFoundData(
          `not found comment, commentId: ${updateCommentInput.commentId}`
        ),
        switchMap((comment: Comment) =>
          (comment.registerUser as Types.ObjectId).toHexString() !==
          user._id.toHexString()
            ? throwError(
                new HttpException(`no permission user`, ErrorType.NO_PERMISSION)
              )
            : of(comment)
        ),
        flatMap((comment: Comment) =>
          this.commentModel
            .updateOne(
              {
                _id: comment._id,
              },
              {
                $set: {
                  content: updateCommentInput.content,
                },
              }
            )
            .exec()
        ),
        map((res) => res.ok === 1)
      )
      .toPromise()
  }

  remove(user: User, commentId: string) {
    return from(this.commentModel.findOne({ _id: commentId }))
      .pipe(
        notFoundData(`not found comment, commentId: ${commentId}`),
        switchMap((comment: Comment) =>
          (comment.registerUser as Types.ObjectId).toHexString() !==
          user._id.toHexString()
            ? throwError(
                new HttpException(`no permission user`, ErrorType.NO_PERMISSION)
              )
            : of(comment)
        ),
        flatMap((comment: Comment) =>
          comment.replyComments.length !== 0
            ? this.commentModel
                .updateOne(
                  {
                    _id: comment._id,
                  },
                  {
                    $set: {
                      delete: true,
                    },
                  }
                )
                .exec()
            : this.commentModel
                .deleteOne({
                  _id: commentId,
                })
                .exec()
        ),
        map((res) => res.ok === 1)
      )
      .toPromise()
  }
}
