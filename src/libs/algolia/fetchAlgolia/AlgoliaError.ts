import { eventMonitoring } from 'libs/monitoring/services'

/**
 * Avoid sending all algolia erros to Sentry to avoid flooding
 * https://github.com/pass-culture/pass-culture-app-native/pull/2193
 * We're using algolia/lite so we don't have access to all the error types
 */
const IGNORED_ALGOLIA_ERRORS: Array<string> = ['RetryError']

const IGNORED_ALGOLIA_MESSAGES: Array<RegExp> = [
  /network request failed/i,
  /erreur lors de la récupération du token/i,
]

const isIgnoredAlgoliaError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false
  }

  const isIgnoredError = IGNORED_ALGOLIA_ERRORS.some(
    (ignoredError) => error.name.toLowerCase() === ignoredError.toLowerCase()
  )
  const isIgnoredMessage = IGNORED_ALGOLIA_MESSAGES.some((messagePattern) =>
    messagePattern.test(error.message)
  )

  return isIgnoredMessage || isIgnoredError
}

export const captureAlgoliaError = (error: unknown): void => {
  if (isIgnoredAlgoliaError(error)) {
    return
  }

  eventMonitoring.captureException(error, {
    extra: {
      source: 'algolia',
    },
  })
}
