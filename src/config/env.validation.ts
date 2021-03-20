import { Exclude, Expose, plainToClass, Transform } from 'class-transformer'
import { validateSync } from 'class-validator'
import Configuration from './configuration'
import { EnvironmentVariables } from './types/env.types'

const defaultValueDecorator = (defaultValue: any) => {
  return Transform((target: any) => target || defaultValue)
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, { skipMissingProperties: true })

  const ymlValidatedConfig = plainToClass(
    EnvironmentVariables,
    Configuration(),
    {
      enableImplicitConversion: true,
    }
  )

  const ymlErrors = validateSync(ymlValidatedConfig)

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  if (ymlErrors.length > 0) {
    throw new Error(ymlErrors.toString())
  }
  return validatedConfig
}
