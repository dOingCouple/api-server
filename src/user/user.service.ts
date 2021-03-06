import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { v4 as uuid } from 'uuid'
import { Model } from 'mongoose'
import { CreateUserInput } from './dto/create-user.input'
import { SignupInput } from '~/user/dto/signup.input'
import { UpdateUserInput } from './dto/update-user.input'
import { User, UserDocument } from './schemas/user.schema'
import { from } from 'rxjs'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(signupInput: SignupInput): Promise<User> {
    return this.userModel.create({
      uuid: uuid(),
      name: signupInput.name,
      email: signupInput.email,
      photoUrl: signupInput.photoUrl,
      provider: signupInput.provider,
    })
  }

  findAll() {
    return `This action returns all user`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
