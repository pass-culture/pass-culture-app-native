import { resolve } from 'path'

import { config as dotEnvConfig } from 'dotenv'

import { parseBooleanVariables } from './parseBooleanVariables'
import { Environment } from './types'

dotEnvConfig({
  path: resolve(__dirname, '../../..', `.env.${process.env.ENV}`),
})

export const env = parseBooleanVariables(process.env) as unknown as Environment
