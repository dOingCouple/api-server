import { Model, Types, Document } from 'mongoose'
import { from } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { PaginationArgs } from '../dto/page-pagination.args'

export function paginate<T extends Document, R>(
  model: Model<T>,
  args: PaginationArgs
) {
  const aggregates = []
  aggregates.push({
    $sort: { _id: -1 },
  })

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

  if (typeof args.before === 'string') {
    aggregates.push({
      $match: {
        _id: {
          $gt: new Types.ObjectId(
            Buffer.from(args.before, 'base64').toString('utf8')
          ),
        },
      },
    })
  }

  aggregates.push({
    $limit: args.next + 1,
  })

  return from(model.aggregate(aggregates))
    .pipe(
      map((responseList: any[]) => {
        const list = responseList.slice(0, args.next)
        const startCursor =
          list.length > 0
            ? Buffer.from(list[0]._id.toString()).toString('base64')
            : undefined
        const endCursor =
          list.length > 1
            ? Buffer.from(list[list.length - 2]._id.toString()).toString(
                'base64'
              )
            : undefined
        const hasNextPage = !!args.before || responseList.length > args.next
        const hasPreviousPage =
          typeof args.after === 'string' || !!(args.before && hasNextPage)
        return {
          nodes: list,
          pageInfo: {
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage,
          },
        }
      })
    )
    .toPromise()
}