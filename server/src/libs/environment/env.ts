import { existsSync } from 'fs'
import { resolve, join } from 'path'

import { config as dotEnvConfig } from 'dotenv'

import { parseBooleanVariables } from './parseBooleanVariables'

const envVariable = process.env.ENV ?? 'this should never happen'

const pathDevSource = join(__dirname, '../../..', `.env.${envVariable}`)
const pathBuildSource = join(__dirname, '../../../..', '.env')
const path = existsSync(pathDevSource) ? resolve(pathDevSource) : resolve(pathBuildSource)
const __DEV__ = pathDevSource === path

if (!existsSync(path)) {
  throw new Error(`DotEnv configuration not found for environment ${envVariable} (${path})`)
}

dotEnvConfig({ path })

export const env = parseBooleanVariables({ ...process.env, __DEV__ })
