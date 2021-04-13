import { HttpException } from '@nestjs/common'
import { Community } from '~/community/schemas/community.schema'
import { Course } from '~/course/schemas/course.schema'
import { ParentType } from '../constants'
import { ErrorType } from '../error.type'

export function findModelName(parentType: ParentType) {
  switch (parentType.valueOf()) {
    case ParentType.COURSE:
      return Course.name
    case ParentType.COMMUNITY:
      return Community.name
    case ParentType.COMMENT:
      return Comment.name
  }
  throw new HttpException(`unknown type: ${parentType}`, ErrorType.UNKNOWN)
}
