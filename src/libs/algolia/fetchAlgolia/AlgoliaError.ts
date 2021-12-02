export const captureAlgoliaError = (_error: unknown): void => {
  // We actually don't send the error to sentry, because there are too many
  // eventMonitoring.captureException(new AlgoliaError(error as Error))
}
