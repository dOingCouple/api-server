import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { from, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { Tag, TagDocument } from './schemas/tag.schema'

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  create(tagName: string) {
    return from(this.findOneByName(tagName))
      .pipe(
        switchMap((tag) =>
          tag
            ? of(tag)
            : this.tagModel.create({
                name: tagName,
              })
        )
      )
      .toPromise()
  }

  findAll() {
    return `This action returns all tag`
  }

  findOneByName(tagName: string) {
    return from(this.tagModel.findOne({ name: tagName })).toPromise()
  }
}
