import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import { UserService } from '~/user/user.service'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly userService: UserService) {
    super()
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  getRequest(context: ExecutionContext): Promise<Request> {
    const ctx = GqlExecutionContext.create(context)
    return from(
      this.userService.findOneByUuid('bc6dcf43-2622-411c-85e9-94e8f96390cf')
    )
      .pipe(map(() => ctx.getContext().req))
      .toPromise()
    // return ctx.getContext().req
  }

  handleRequest(err: unknown, user: any, info: unknown) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
