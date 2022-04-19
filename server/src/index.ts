import { region } from 'firebase-functions'

import { app } from './app'
import { env } from './libs/environment/env'
import { logger } from './utils/logging'

let appServer

if (env.__DEV__) {
  const PORT = Number(process.env.PORT) || 8080
  appServer = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    /* istanbul ignore next */
    process.env.NODE_ENV !== 'test' && logger.info(`[${process.env.ENV}] Listening on port ${PORT}`)
  })
} else {
  /* istanbul ignore next */
  const { https } = region(env.REGION)
  // TODO: see if unit test of next line is possible using https://www.npmjs.com/package/firebase-functions-test
  appServer = https.onRequest(app)
}

export const server = appServer
