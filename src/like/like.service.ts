import { HttpException, Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { forkJoin, from, of, throwError } from 'rxjs'
import { flatMap } from 'rxjs/internal/operators'
import { map, switchMap } from 'rxjs/operators'
import { ErrorType } from '~/common/error.type'
import { BasePost } from '~/common/schemas/base-post.schema'
import { findModelName } from '~/common/utils/like.enum'
import { findOneBasePost } from '~/common/utils/mongo'
import { parseObjectId } from '~/common/utils/string'
import { User } from '~/user/schemas/user.schema'
import { CreateLikeInput } from './dto/create-like.input'
import { Like, LikeDocument } from './schemas/like.scheme'

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectConnection() private connection: Connection
  ) {}

  async create(user: User, createLikeInput: CreateLikeInput) {
    return findOneBasePost(
      this.connection,
      createLikeInput.parentType,
      createLikeInput.parentId,
      {
        path: 'likes',
      }
    )
      .pipe(
        switchMap((basePost: BasePost) =>
          basePost.likes.map((like) => like.registerUser).includes(user._id)
            ? throwError(
                new HttpException(
                  'already add like',
                  ErrorType.ALREADY_ADD_LIKE
                )
              )
            : of(basePost)
        ),
        flatMap(() =>
          this.likeModel.create(Like.createLike(user, createLikeInput))
        ),
        flatMap((like) => {
          return this.connection
            .model(findModelName(createLikeInput.parentType))
            .updateOne(
              {
                _id: like.parentId,
              },
              {
                $push: {
                  likes: like._id,
                },
              }
            )
            .exec()
        }),
        map((data) => data.ok === 1)
      )
      .toPromise()
  }

  findAll() {
    return `This action returns all like`
  }

  findOne(id: number) {
    return `This action returns a #${id} like`
  }

  remove(user: User, id: string): Promise<boolean> {
    return from(
      this.likeModel.findById({
        _id: id,
      })
    )
      .pipe(
        switchMap((like) =>
          !like
            ? throwError(
                new HttpException(
                  `like model is null, id: ${id}`,
                  ErrorType.NOT_FOUND_DATA
                )
              )
            : of(like)
        ),
        switchMap((like) =>
          like.registerUser === user._id
            ? throwError(
                new HttpException(
                  `like register user is no permission`,
                  ErrorType.NO_PERMISSION
                )
              )
            : of(like)
        ),
        switchMap((like) =>
          forkJoin([
            this.likeModel
              .deleteOne({
                _id: id,
              })
              .exec(),
            this.connection
              .collection(findModelName(like.parentType))
              .updateOne(
                {
                  _id: like.parentId,
                },
                {
                  $pull: {
                    likes: like._id,
                  },
                }
              ),
          ])
        ),
        map(
          ([resRemove, resPull]) =>
            resRemove.deletedCount === 1 && resPull.result.ok === 1
        )
      )
      .toPromise()
  }
}
