import { eventMonitoring } from 'libs/monitoring/services'

/**
 * Avoid sending all algolia erros to Sentry to avoid flooding
 * https://github.com/pass-culture/pass-culture-app-native/pull/2193
 */
const IGNORED_ALGOLIA_ERRORS: Array<{ name?: string; messagePattern?: RegExp }> = [
  {
    name: 'RetryError',
    messagePattern: /unreachable hosts/i,
  },
  {
    name: 'TypeError',
    messagePattern: /network request failed/i,
  },
  {
    messagePattern: /erreur lors de la récupération du token/i,
  },
]

const isIgnoredAlgoliaError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false
  }

  return IGNORED_ALGOLIA_ERRORS.some((ignoredError) => {
    const nameMatches = ignoredError.name === undefined || error.name === ignoredError.name
    const messageMatches =
      ignoredError.messagePattern === undefined || ignoredError.messagePattern.test(error.message)

    return nameMatches && messageMatches
  })
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
