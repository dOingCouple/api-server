import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '~/user/schemas/user.schema'
import { CreateCommunityInput } from './dto/create-community.input'
import { UpdateCommunityInput } from './dto/update-community.input'
import { Community, CommunityDocument } from './schemas/community.schema'

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name)
    private communityModel: Model<CommunityDocument>
  ) {}

  create(
    user: User,
    createCommunityInput: CreateCommunityInput
  ): Promise<Community> {
    return this.communityModel.create(
      Community.createCommunity(user, createCommunityInput)
    )
  }

  findAll() {
    return `This action returns all community`
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
