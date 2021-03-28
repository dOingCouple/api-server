import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { AuthService } from '../auth.service'

@Injectable()
export class RestGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super()
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest()
  }

  handleRequest(err: unknown, user: any, info: unknown, context) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }

    return user
  }
}
