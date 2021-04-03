import { Model, Types, Document } from 'mongoose'
import { from } from 'rxjs'
import { tap } from 'rxjs/operators'
import { PaginationArgs } from '../dto/page-pagination.args'

export function paginate<T extends Document, R>(
  model: Model<T>,
  args: PaginationArgs,
  returnType?: R
) {
  const aggregates = []
  if (typeof args.after === 'string') {
    aggregates.push({
      $match: {
        _id: {
          $lt: new Types.ObjectId(
            Buffer.from(args.after, 'base64').toString('utf8')
          ),
        },
      },
    })
  }

  aggregates.push({
    $limit: args.next,
  })

  return from(model.aggregate(aggregates)).toPromise()
}
