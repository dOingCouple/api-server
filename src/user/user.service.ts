import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { from } from 'rxjs'
import { Provider } from '~/common/constants'
import { SignUpInput } from '~/auth/dto/sign-up.input'
import { PaginationArgs } from '~/common/dto/page-pagination.args'
import { paginate } from '~/common/utils/pagination'
import { PaginatedUser } from './dto/paginated-user.output'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(signUpInput: SignUpInput): Promise<User> {
    return from(this.userModel.create(User.createUser(signUpInput)))
      .pipe()
      .toPromise()
  }

  findOneByUuid(uuid: string): Promise<User> {
    return this.userModel.findOne({ uuid }).exec()
  }

  findOneByEmailAndProvider({
    email,
    provider,
  }: {
    email: string
    provider: Provider
  }): Promise<User | undefined> {
    return this.userModel.findOne({ email, provider }).exec()
  }

  findAll(args: PaginationArgs): Promise<PaginatedUser> {
    return paginate(this.userModel, args)
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }

  existNickName(nickName: string): Promise<boolean> {
    return this.userModel.exists({ nickName })
  }
}
