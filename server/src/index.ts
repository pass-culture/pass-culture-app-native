// for some reason, this is scanned by root project and cause a linting error
// eslint-disable-next-line import/no-unresolved

import { https } from 'firebase-functions'

import { app } from './app'

export const appFunction = https.onRequest(app)
