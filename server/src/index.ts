import { app } from './app'

const PORT = process.env.PORT || 8080

export const server = app.listen(Number(PORT),() => {
  /* istanbul ignore next */
  // eslint-disable-next-line no-console
  process.env.NODE_ENV !== 'test' && console.log(`[${process.env.ENV}] Listening on port ${PORT}`)
})
