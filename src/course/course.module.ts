import { Module } from '@nestjs/common'
import { CourseService } from './course.service'
import { CourseResolver } from './course.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Course, CourseSchema } from './schemas/course.schema'
import { TagModule } from '~/tag/tag.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
    TagModule,
  ],
  providers: [CourseResolver, CourseService],
})
export class CourseModule {}
