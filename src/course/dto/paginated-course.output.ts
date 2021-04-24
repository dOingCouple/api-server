import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql'
import { Paginated } from '~/common/dto/page-pagination.output'
import { Course } from '../schemas/course.schema'

@ObjectType()
class CourseOutput extends OmitType(Course, ['comments', 'likes', 'tags']) {
  @Field(() => [String], { description: '태그 리스트' })
  tags: string[]

  @Field(() => Int, { description: '댓글 개수' })
  cntComment: number

  @Field(() => Int, { description: '좋아요 개수' })
  cntLike: number
}

@ObjectType()
export class PaginatedCourse extends Paginated(CourseOutput) {}
