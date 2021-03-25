import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { from, of, throwError } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { flatMap } from 'rxjs/internal/operators'
import { ConfigService } from '@nestjs/config'
import { createHash } from 'crypto'
import { ErrorType } from '~/common/error.type'
import { User } from '~/user/schemas/user.schema'
import { UserService } from '~/user/user.service'
import { Me } from './dto/me.out'
import { SignInInput } from './dto/sign-in.input'
import { SignInOutput } from './dto/sign-in.output'
import { SignUpInput } from './dto/sign-up.input'
import { RedisService } from 'nestjs-redis'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService
  ) {}

  signIn(signInInput: SignInInput): Promise<SignInOutput> {
    return from(this.userService.findOneByEmailAndProvider({ ...signInInput }))
      .pipe(
        switchMap((user) => {
          const hash = createHash('sha256').digest('base64')
          return user
            ? from(this.jwtService.signAsync({ uuid: user.uuid, hash })).pipe(
                tap(() => this.setSession(user.uuid, hash))
              )
            : throwError(
                new HttpException({ ...signInInput }, ErrorType.NOT_FOUND_USER)
              )
        }),
        map((jwt) => ({ accessToken: jwt }))
      )
      .toPromise()
  }

  signUp(signUpInput: SignUpInput): Promise<Me> {
    return from(this.userService.create(signUpInput))
      .pipe(map((user): Me => ({ nickName: user.nickName, uuid: user.uuid })))
      .toPromise()
  }

  setSession(uuid: string, hash: string): void {
    this.redisService
      .getClient()
      .set(
        this.getSessionKey(uuid),
        hash,
        'EX',
        this.configService.get<number>('jwt.expiredSecond')
      )
  }

  getSessionKey(uuid: string): string {
    return `SESSION:${uuid}`
  }

  getSession(uuid: string): Promise<string | undefined> {
    return this.redisService.getClient().get(this.getSessionKey(uuid))
  }
}
