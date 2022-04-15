import { app } from './app'
import { logger } from './utils/logging'

const PORT = Number(process.env.PORT) || 8080

export const server = app.listen(PORT, () => {
  /* istanbul ignore next */
  // eslint-disable-next-line no-console
  process.env.NODE_ENV !== 'test' && logger.info(`[${process.env.ENV}] Listening on port ${PORT}`)
})
