import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { from } from 'rxjs'
import { flatMap } from 'rxjs/internal/operators'
import { map, tap } from 'rxjs/operators'
import { PaginationArgs } from '~/common/dto/page-pagination.args'
import { getCollectionName } from '~/common/utils/mongo'
import { paginate } from '~/common/utils/pagination'
import { Tag } from '~/tag/schemas/tag.schema'
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
    private readonly tagService: TagService,
    @InjectConnection() private connection: Connection
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

  findAll(args: PaginationArgs) {
    return paginate(this.communityModel, args, [
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

  findOne(id: string) {
    return this.communityModel.findById(id)
  }

  update(id: string, updateCommunityInput: UpdateCommunityInput) {
    return `This action updates a #${id} community`
  }

  remove(id: string) {
    return `This action removes a #${id} community`
  }
}
