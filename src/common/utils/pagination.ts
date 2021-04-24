import { Model, Types, Document } from 'mongoose'
import { from } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { PaginationArgs } from '../dto/page-pagination.args'
import { parsePaginateObjectId } from './string'

export function paginate<T extends Document, R>(
  model: Model<T>,
  args: PaginationArgs,
  querys?: any[]
) {
  const aggregates = []
  aggregates.push({
    $sort: { _id: -1 },
  })

  if (typeof args.after === 'string') {
    aggregates.push({
      $match: {
        _id: {
          $lt: parsePaginateObjectId(args.after),
        },
      },
    })
  }

  if (typeof args.before === 'string') {
    aggregates.push({
      $match: {
        _id: {
          $gt: parsePaginateObjectId(args.before),
        },
      },
    })
  }

  aggregates.push({
    $limit: args.next + 1,
  })

  aggregates.push({
    $sort: {
      _id: -1,
    },
  })

  querys.forEach((query) => aggregates.push(query))

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
