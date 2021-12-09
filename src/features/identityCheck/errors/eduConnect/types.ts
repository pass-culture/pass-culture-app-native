/*
 * Here all errors returned by edu connect or pass culture api
 */

export class EduConnectError extends Error {
  public initialError: Error | undefined

  constructor(messageOrInitialError?: Error | string) {
    super()
    if (messageOrInitialError) {
      if (typeof messageOrInitialError === 'string') {
        this.message = messageOrInitialError
      } else {
        this.stack = messageOrInitialError.stack
        this.message = messageOrInitialError.message
        this.initialError = messageOrInitialError
      }
    }
  }
}

EduConnectError.prototype.name = 'EduConnectError'
