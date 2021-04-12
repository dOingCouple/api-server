import { HttpException } from '@nestjs/common'
import { COLLECTION_NAME as CommunityName } from '~/community/schemas/community.schema'
import { COLLECTION_NAME as CourseName } from '~/course/schemas/course.schema'
import { LikeType } from '../constants'
import { ErrorType } from '../error.type'

export function findModelName(likeType: LikeType) {
  switch (likeType.valueOf()) {
    case LikeType.COURSE:
      return CourseName
    case LikeType.COMMUNITY:
      return CommunityName
    case LikeType.COMMENT:
      return Comment.name
  }
  throw new HttpException(`unknown type: ${likeType}`, ErrorType.UNKNOWN)
}
