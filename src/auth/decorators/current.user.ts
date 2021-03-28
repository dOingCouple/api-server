import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
  }
)

export const RestCurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user
  }
)
