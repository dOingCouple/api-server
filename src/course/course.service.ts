import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '~/user/schemas/user.schema'
import { CreateCourseInput } from './dto/create-course.input'
import { UpdateCourseInput } from './dto/update-course.input'
import { Course, CourseDocument } from './schemas/course.schema'

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>
  ) {}

  create(user: User, createCourseInput: CreateCourseInput): Promise<Course> {
    return this.courseModel.create(Course.createCourse(user, createCourseInput))
  }

  findAll(): Promise<Course[]> {
    return this.courseModel.find().sort({ createdAt: -1 }).exec()
  }

  findOne(id: number) {
    return `This action returns a #${id} course`
  }

  update(id: number, updateCourseInput: UpdateCourseInput) {
    return `This action updates a #${id} course`
  }

  remove(id: number) {
    return `This action removes a #${id} course`
  }
}
