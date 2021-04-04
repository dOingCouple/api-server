import { createHash } from 'crypto'

export function randomString(radix = 36) {
  return Math.random().toString(radix).substr(2, 10).toUpperCase()
}

export function createOtp(value?: string) {
  if (!value) {
    value = randomString()
  }
  return createHash('sha256').update(value).digest('base64')
}
