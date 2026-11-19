import { app } from './app'
import { env } from './libs/environment/serverEnv'
import { logger } from './utils/logging'

const PORT = Number(process.env.PORT) || 8080

export const server = app.listen(PORT, () => {
  /* istanbul ignore next */
  process.env.NODE_ENV !== 'test' && logger.info(`[${env.ENV}] Listening on port ${PORT}`)
})
