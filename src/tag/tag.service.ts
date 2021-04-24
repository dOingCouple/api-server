import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { from, of } from 'rxjs'
import { flatMap } from 'rxjs/internal/operators'
import { switchMap } from 'rxjs/operators'
import { Tag, TagDocument } from './schemas/tag.schema'

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  create(tagName: string) {
    return from(this.findOneByName(tagName))
      .pipe(
        switchMap((tag) =>
          tag ? of(tag) : this.tagModel.create(Tag.createTag(tagName))
        )
      )
      .toPromise()
  }

  createTags(tagNames: string[]) {
    return from(this.findByNames(tagNames))
      .pipe(
        flatMap((tags) => {
          const existTagNames = tags.map((tag) => tag.name)
          const notExistTagNames = tagNames.filter(
            (tagName: string) => !existTagNames.includes(tagName)
          )
          return this.tagModel.insertMany(
            notExistTagNames.map((tagName) => Tag.createTag(tagName))
          )
        }),
        flatMap(() => this.findByNames(tagNames))
      )
      .toPromise()
  }

  findAll() {
    return this.tagModel.find().exec()
  }

  findOneByName(tagName: string) {
    return from(this.tagModel.findOne({ name: tagName })).toPromise()
  }

  findByNames(tagNames: string[]) {
    return from(
      this.tagModel.find({
        name: {
          $in: tagNames,
        },
      })
    ).toPromise()
  }
}
