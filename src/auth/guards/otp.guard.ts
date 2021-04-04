import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { from } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { AuthService } from '../auth.service'

const HEADER_OTP = 'X-Otp'

@Injectable()
export class OtpGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const otp = request.headers[HEADER_OTP.toLowerCase()]
    if (!otp) {
      return false
    }

    return from(this.authService.existOtp(otp))
      .pipe(
        tap(() => this.authService.removeOtp(otp)),
        map((res) => !!res)
      )
      .toPromise()
  }
}
