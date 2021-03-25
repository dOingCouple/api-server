import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator'

export enum Environment {
  Mock = 'mock',
  Local = 'local',
  Dev = 'dev',
  Production = 'prod',
  Test = 'test',
}

class ServerHttp {
  @IsNumber()
  @IsNotEmpty()
  port: number
}

class ServerSsl {
  @IsNotEmpty()
  @IsString()
  privkeyPath: string

  @IsNotEmpty()
  @IsString()
  pubPath: string
}

class Server {
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  http: ServerHttp

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  https: ServerHttp

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  ssl: ServerSsl
}

class Mongo {
  @IsNotEmpty()
  @IsString()
  uri: string

  @IsNotEmpty()
  @IsString()
  user: string

  @IsNotEmpty()
  @IsString()
  password: string
}

class Jwt {
  @IsNotEmpty()
  @IsString()
  secret: string
  expiredSecond: number
}

class Graphql {
  @IsBoolean()
  @IsNotEmpty()
  playground: boolean

  @IsString()
  @IsNotEmpty()
  schemaFile: string
}

class Redis {
  @IsString()
  @IsNotEmpty()
  host: string

  @IsNumber()
  @IsNotEmpty()
  port: number
}

export class EnvironmentVariables {
  // @IsEnum(Environment)
  NODE_ENV: Environment

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  server: Server

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  mongo: Mongo

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  jwt: Jwt

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  graphql: Graphql

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  redis: Redis
}
