import { plainToClass, Type } from 'class-transformer'
import {
  IsEnum,
  IsNumber,
  validateSync,
  IsString,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsNotEmptyObject,
} from 'class-validator'

enum Environment {
  Mock = 'mock',
  Local = 'local',
  Dev = 'dev',
  Production = 'prod',
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

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  mongo: Mongo
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, { skipMissingProperties: true })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
