import { Model, Document, Connection } from 'mongoose'
import {} from '@nestjs/mongoose'
import { ParentType } from '../constants'
import { from, of, throwError } from 'rxjs'
import { findModelName } from './like.enum'
import { switchMap } from 'rxjs/operators'
import { HttpException } from '@nestjs/common'
import { ErrorType } from '../error.type'

export function findOne<T extends Document>(
  model: Model<T>,
  collectionName: string,
  query: any
) {
  return model.collection.conn.collection(collectionName).findOne(query)
}

export function updateOne<T extends Document>(
  model: Model<T>,
  collectionName: string,
  query: any,
  data: any
) {
  model.collection.conn.collection(collectionName).updateOne(query, data)
}

export function findOneBasePost(
  connection: Connection,
  parentType: ParentType,
  parentId: string,
  populate?: { [key: string]: string }
) {
  return from(
    connection
      .model(findModelName(parentType))
      .findOne({
        _id: parentId,
      })
      .populate(populate)
  ).pipe(
    switchMap((obj: any) =>
      !obj
        ? throwError(
            new HttpException(
              { parentType, parentId, populate },
              ErrorType.NOT_FOUND_DATA
            )
          )
        : of(obj)
    )
  )
}
