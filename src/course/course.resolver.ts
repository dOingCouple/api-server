import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql'
import { CourseService } from './course.service'
import { Course } from './schemas/course.schema'
import { CreateCourseInput } from './dto/create-course.input'
import { UpdateCourseInput } from './dto/update-course.input'
import { HttpException, UseGuards } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'
import { CurrentUser } from '~/auth/decorators/current.user'
import { User } from '~/user/schemas/user.schema'
import { GqlAuthGuard } from '~/auth/guards/gql.guard'
import { PaginationArgs } from '~/common/dto/page-pagination.args'
import { PaginatedCourse } from './dto/paginated-course.output'

const pubsub = new PubSub()

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Course)
  createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
    @CurrentUser() user: User
  ) {
    return this.courseService.create(user, createCourseInput)
  }

  @Query(() => PaginatedCourse, { name: 'courses' })
  async findAll(@Args() args: PaginationArgs): Promise<PaginatedCourse> {
    const res = await this.courseService.findAll(args)
    return Promise.resolve(res)
  }

  @Query(() => Course, { name: 'course' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.courseService.findOne(id)
  }

  @Mutation(() => Course)
  updateCourse(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput
  ) {
    return this.courseService.update(updateCourseInput.id, updateCourseInput)
  }

  @Mutation(() => Course)
  removeCourse(@Args('id', { type: () => Int }) id: number) {
    return this.courseService.remove(id)
  }

  @Subscription(() => Course)
  newCourse() {
    pubsub.asyncIterator('aha')
  }
}
