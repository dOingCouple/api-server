import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { from, of } from 'rxjs'
import { UserService } from '~/user/user.service'
import { switchMap } from 'rxjs/operators'
import { User } from '~/user/schemas/user.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    })
  }

  async validate(payload: { uuid: string }): Promise<User> {
    return from(this.userService.findOneByUuid(payload.uuid)).toPromise()
  }

  authenticate(promiseRequest: any, options) {
    super.authenticate(promiseRequest, options)
    // from(promiseRequest).subscribe((req) =>
    //   super.authenticate(req as any, options)
    // )
  }
}
