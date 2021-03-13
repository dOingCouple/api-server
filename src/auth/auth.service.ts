import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { from, of, throwError } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { flatMap } from 'rxjs/internal/operators'
import { ErrorType } from '~/common/error.type'
import { User } from '~/user/schemas/user.schema'
import { UserService } from '~/user/user.service'
import { Me } from './dto/me.out'
import { SignInInput } from './dto/sign-in.input'
import { SignInOutput } from './dto/sign-in.output'
import { SignUpInput } from './dto/sign-up.input'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  signIn(signInInput: SignInInput): Promise<SignInOutput> {
    return from(this.userService.findOneByEmailAndProvider({ ...signInInput }))
      .pipe(
        switchMap((user) =>
          user
            ? from(this.jwtService.signAsync({ uuid: user.uuid }))
            : throwError(
                new HttpException({ ...signInInput }, ErrorType.NOT_FOUND_USER)
              )
        ),
        map((jwt) => ({ accessToken: jwt }))
      )
      .toPromise()
  }

  signUp(signUpInput: SignUpInput): Promise<Me> {
    return from(this.userService.create(signUpInput))
      .pipe(map((user): Me => ({ nickName: user.nickName, uuid: user.uuid })))
      .toPromise()
  }
}
