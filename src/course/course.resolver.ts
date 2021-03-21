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
import { HttpException, HttpStatus } from '@nestjs/common'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => Course)
  createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput
  ) {
    return this.courseService.create(null, createCourseInput)
  }

  @Query(() => [Course], { name: 'courseList' })
  findAll(): Promise<Course[]> {
    throw new HttpException('Forbidden', 12312312)
    // return this.courseService.findAll()
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
