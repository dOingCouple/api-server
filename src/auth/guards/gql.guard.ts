import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../auth.service'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super()
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  handleRequest(err: unknown, user: any, info: unknown, context) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }

    const gqlContext = GqlExecutionContext.create(context)
    gqlContext.getContext().req.user = user
    return user
  }
}
