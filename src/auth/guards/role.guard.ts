import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from '~/user/schemas/user.schema'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles) {
      return true
    }
    const gqlContext = GqlExecutionContext.create(context)
    const user: User | undefined = gqlContext.getContext().req.user
    if (roles.includes(user?.role)) {
      return true
    }

    throw new UnauthorizedException()
  }
}
