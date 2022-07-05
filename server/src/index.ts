// FIXME(kopax): for some reason, this is scanned by root project and cause a linting error
// eslint-disable-next-line import/no-unresolved

import { app } from './app'
import { env } from './libs/environment/env'
import { logger } from './utils/logging'

const PORT = Number(process.env.PORT) || 8080

export const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  /* istanbul ignore next */
  process.env.NODE_ENV !== 'test' && logger.info(`[${env.ENV}] Listening on port ${PORT}`)
})
