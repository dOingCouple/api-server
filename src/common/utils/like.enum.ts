import { HttpException } from '@nestjs/common'
import { Community } from '~/community/schemas/community.schema'
import { Course } from '~/course/schemas/course.schema'
import { LikeType } from '../constants'
import { ErrorType } from '../error.type'

export function findModelName(likeType: LikeType) {
  switch (likeType.valueOf()) {
    case LikeType.COURSE:
      return Course.name
    case LikeType.COMMUNITY:
      return Community.name
    case LikeType.COMMENT:
      return Comment.name
  }
  throw new HttpException(`unknown type: ${likeType}`, ErrorType.UNKNOWN)
}
