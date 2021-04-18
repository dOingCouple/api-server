import { HttpException } from '@nestjs/common'
import { of, throwError } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { ErrorType } from './error.type'

export function notFoundData(errorMessage?: string) {
  return switchMap((comment) =>
    !comment
      ? throwError(new HttpException(errorMessage, ErrorType.NOT_FOUND_DATA))
      : of(comment)
  )
}
