import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { from } from 'rxjs'
import { flatMap } from 'rxjs/internal/operators'
import { map } from 'rxjs/operators'
import { PaginationArgs } from '~/common/dto/page-pagination.args'
import { getCollectionName } from '~/common/utils/mongo'
import { paginate } from '~/common/utils/pagination'
import { Tag } from '~/tag/schemas/tag.schema'
import { TagService } from '~/tag/tag.service'
import { User } from '~/user/schemas/user.schema'
import { CreateCourseInput } from './dto/create-course.input'
import { PaginatedCourse } from './dto/paginated-course.output'
import { UpdateCourseInput } from './dto/update-course.input'
import { Course, CourseDocument } from './schemas/course.schema'

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private readonly tagService: TagService,
    @InjectConnection() private connection: Connection
  ) {}

  create(user: User, createCourseInput: CreateCourseInput): Promise<Course> {
    return from(this.tagService.createTags(createCourseInput.tagNames))
      .pipe(
        map((tags) => Course.createCourse(user, createCourseInput, tags)),
        flatMap((course) => this.courseModel.create(course))
      )
      .toPromise()
  }
  findAll(args: PaginationArgs): Promise<PaginatedCourse> {
    return paginate(this.courseModel, args, [
      {
        $lookup: {
          from: getCollectionName(this.connection, User.name),
          localField: 'registerUser',
          foreignField: '_id',
          as: 'registerUser',
        },
      },
      {
        $unwind: '$registerUser',
      },
      {
        $lookup: {
          from: getCollectionName(this.connection, Tag.name),
          localField: 'tags',
          foreignField: '_id',
          as: 'tags',
        },
      },
      {
        $addFields: {
          tags: '$tags.name',
        },
      },
      {
        $set: {
          cntComment: {
            $size: {
              $ifNull: ['$comments', []],
            },
          },
          cntLike: {
            $size: {
              $ifNull: ['$likes', []],
            },
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ])
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
