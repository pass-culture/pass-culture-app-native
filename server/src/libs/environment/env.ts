import { resolve } from 'path'

import { config as dotEnvConfig } from 'dotenv'

import { Environment } from './types'

dotEnvConfig({
  path: resolve(__dirname, '../../..', `.env.${process.env.ENV}`),
})

export const env = process.env as unknown as Environment
