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
import { Me } from './dto/me.output'
import { SignInInput } from './dto/sign-in.input'
import { SignInOutput } from './dto/sign-in.output'
import { SignUpInput } from './dto/sign-up.input'
import { RedisService } from 'nestjs-redis'
import { ExistNickNameOutput } from './dto/exist-nick-name.output'
import { ExistNickNameInput } from './dto/exist-nick-name.input'
import { OtpOutput } from './dto/otp.output'
import { createOtp } from '~/common/utils/random'

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
          const hash = createHash('sha256')
            .update(String(new Date().getTime))
            .digest('base64')
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

  existNickName(input: ExistNickNameInput): Promise<ExistNickNameOutput> {
    return from(this.userService.existNickName(input.nickName))
      .pipe(map((exist): ExistNickNameOutput => ({ exist })))
      .toPromise()
  }

  createOtp(): Promise<OtpOutput> {
    return of(createOtp())
      .pipe(
        tap((otp) => {
          this.redisService.getClient().set(this.getOtpKey(otp), otp, 'EX', 30)
        }),
        map((otp): OtpOutput => ({ value: otp }))
      )
      .toPromise()
  }

  getOtpKey(otp: string): string {
    return `OTP:${otp}`
  }

  existOtp(otp: string): Promise<string | undefined> {
    return this.redisService.getClient().get(this.getOtpKey(otp))
  }

  removeOtp(otp: string) {
    return this.redisService.getClient().del(this.getOtpKey(otp))
  }
}
