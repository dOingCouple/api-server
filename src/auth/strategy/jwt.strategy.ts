import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { from, of, throwError } from 'rxjs'
import { UserService } from '~/user/user.service'
import { switchMap } from 'rxjs/operators'
import { User } from '~/user/schemas/user.schema'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    })
  }

  async validate(payload: { uuid: string; hash: string }): Promise<User> {
    return from(this.authService.getSession(payload.uuid))
      .pipe(
        switchMap((hash) =>
          hash === payload.hash
            ? from(this.userService.findOneByUuid(payload.uuid))
            : throwError(new UnauthorizedException())
        )
      )
      .toPromise()
  }

  authenticate(promiseRequest: any, options) {
    super.authenticate(promiseRequest, options)
  }
}
