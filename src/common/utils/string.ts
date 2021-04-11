import { Types } from 'mongoose'

export function parseObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id)
}

export function parsePaginateObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(Buffer.from(id, 'base64').toString('utf8'))
}
