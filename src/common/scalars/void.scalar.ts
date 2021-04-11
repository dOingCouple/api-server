import { Scalar, CustomScalar } from '@nestjs/graphql'

@Scalar('Void')
export class VoidScalar implements CustomScalar<any, null> {
  description = 'void scalar type'
  parseValue() {
    return null
  }
  serialize() {
    return null
  }
  parseLiteral() {
    return null
  }
}
