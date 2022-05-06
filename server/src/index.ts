// FIXME: for some reason, this is scanned by root project and cause a linting error
// eslint-disable-next-line import/no-unresolved
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
    process.env.NODE_ENV !== 'test' && logger.info(`[${env.ENV}] Listening on port ${PORT}`)
  })
} else {
  // TODO: see if unit test of next line is possible using https://www.npmjs.com/package/firebase-functions-test
  appServer = region(env.REGION).https.onRequest(app)
}

const functionName = process.env.NODE_ENV === 'test' ? 'server' : `server${env.ENV[0].toUpperCase()}${env.ENV.slice(1)}`

module.exports[functionName] = appServer
