import { eventMonitoring } from 'libs/monitoring'

// https://www.algolia.com/doc/api-client/methods/advanced/#error-handling
class AlgoliaError extends Error {
  name = 'AlgoliaError'

  constructor(error: Error) {
    super(error.message)
    this.name = error.name
  }
}

export const captureAlgoliaError = (error: unknown): void => {
  eventMonitoring.captureException(new AlgoliaError(error as Error))
}
