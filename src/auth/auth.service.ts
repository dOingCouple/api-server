import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { from } from 'rxjs'
import { User } from '~/user/schemas/user.schema'
import { UserService } from '~/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  login(user: User) {
    return from(this.jwtService.signAsync(user.uuid))
  }
}
