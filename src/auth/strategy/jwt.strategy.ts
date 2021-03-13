import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { from } from 'rxjs'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }
  }

  authenticate(promiseRequest: any, options) {
    console.log(promiseRequest !== null)
    from(promiseRequest).subscribe((req) =>
      super.authenticate(req as any, options)
    )
  }
}
