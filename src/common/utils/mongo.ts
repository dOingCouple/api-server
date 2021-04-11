import { Model, Document } from 'mongoose'
import {} from '@nestjs/mongoose'

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
