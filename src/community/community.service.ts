import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { from } from 'rxjs'
import { flatMap } from 'rxjs/internal/operators'
import { map, tap } from 'rxjs/operators'
import { TagService } from '~/tag/tag.service'
import { User } from '~/user/schemas/user.schema'
import { CreateCommunityInput } from './dto/create-community.input'
import { UpdateCommunityInput } from './dto/update-community.input'
import { Community, CommunityDocument } from './schemas/community.schema'

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name)
    private communityModel: Model<CommunityDocument>,
    private readonly tagService: TagService
  ) {}

  create(
    user: User,
    createCommunityInput: CreateCommunityInput
  ): Promise<Community> {
    return from(this.tagService.createTags(createCommunityInput.tagNames))
      .pipe(
        map((tags) =>
          Community.createCommunity(user, createCommunityInput, tags)
        ),
        flatMap((community) => this.communityModel.create(community))
      )
      .toPromise()
  }

  findAll() {
    return this.communityModel
      .find()
      .populate({
        path: 'likes',
        populate: {
          path: 'registerUser',
        },
      })
      .populate('tags')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'registerUser',
          },
          {
            path: 'replyComments',
            populate: [
              {
                path: 'registerUser',
              },
              {
                path: 'targetUser',
              },
            ],
          },
        ],
      })
      .populate('registerUser')
  }

  findOne(id: number) {
    return `This action returns a #${id} community`
  }

  update(id: number, updateCommunityInput: UpdateCommunityInput) {
    return `This action updates a #${id} community`
  }

  remove(id: number) {
    return `This action removes a #${id} community`
  }
}
