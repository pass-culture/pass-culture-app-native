// for some reason, this is scanned by root project and cause a linting error
// eslint-disable-next-line import/no-unresolved

import { https } from 'firebase-functions'

import { app } from './app'
import { env } from './libs/environment/env'

export const appFunction = https.onRequest({ region: env.REGION }, app)
