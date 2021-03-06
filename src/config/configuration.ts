import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'

const YAML_CONFIG_FILENAME = `${process.env.NODE_ENV}.yml`

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, `../../env/${YAML_CONFIG_FILENAME}`), 'utf8')
  ) as unknown
}
