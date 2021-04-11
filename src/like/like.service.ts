import { HttpException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { from, of, throwError } from 'rxjs'
import { flatMap } from 'rxjs/internal/operators'
import { map, switchMap, tap } from 'rxjs/operators'
import { ErrorType } from '~/common/error.type'
import { findOne, updateOne } from '~/common/utils/mongo'
import { parseObjectId } from '~/common/utils/string'
import { User } from '~/user/schemas/user.schema'
import { CreateLikeInput } from './dto/create-like.input'
import { Like, LikeDocument } from './schemas/like.scheme'

@Injectable()
export class LikeService {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  create(user: User, createLikeInput: CreateLikeInput) {
    return from(
      findOne(this.likeModel, 'communities', {
        _id: parseObjectId(createLikeInput.parentId),
      })
    )
      .pipe(
        switchMap((obj: any) =>
          !obj
            ? throwError(
                new HttpException(
                  { ...createLikeInput },
                  ErrorType.NOT_FOUND_DATA
                )
              )
            : of(obj)
        ),
        flatMap(() =>
          this.likeModel.create(Like.createLike(user, createLikeInput))
        ),
        map((like) => {
          updateOne(
            this.likeModel,
            'communities',
            {
              _id: like.parentId,
            },
            {
              $push: {
                likes: like._id,
              },
            }
          )
          return null
        })
      )
      .toPromise()
  }

  findAll() {
    return `This action returns all like`
  }

  findOne(id: number) {
    return `This action returns a #${id} like`
  }

  remove(id: number) {
    return `This action removes a #${id} like`
  }
}
