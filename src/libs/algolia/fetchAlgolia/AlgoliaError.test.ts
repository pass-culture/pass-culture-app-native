import { eventMonitoring } from 'libs/monitoring/services'

import { captureAlgoliaError } from './AlgoliaError'

jest.mock('libs/monitoring/services')

describe('captureAlgoliaError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('should NOT capture ignored errors', () => {
    it('should not capture RetryError by name', () => {
      const error = new Error('Some message')
      error.name = 'RetryError'

      captureAlgoliaError(error)

      expect(eventMonitoring.captureException).not.toHaveBeenCalled()
    })

    it.each([
      'network request failed',
      'Something went wrong: network request failed due to timeout',
      'erreur lors de la récupération du token',
    ])('should not capture errors with message "%s"', (message) => {
      const error = new Error(message)

      captureAlgoliaError(error)

      expect(eventMonitoring.captureException).not.toHaveBeenCalled()
    })
  })

  describe('should capture non-Error values', () => {
    it('should capture when error is a string', () => {
      captureAlgoliaError('some error string')

      expect(eventMonitoring.captureException).toHaveBeenCalledWith('some error string', {
        extra: { source: 'algolia' },
      })
    })

    it('should capture when error is null', () => {
      captureAlgoliaError(null)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(null, {
        extra: { source: 'algolia' },
      })
    })

    it('should capture when error is undefined', () => {
      captureAlgoliaError(undefined)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(undefined, {
        extra: { source: 'algolia' },
      })
    })

    it('should capture when error is a plain object', () => {
      const error = { message: 'RetryError' }

      captureAlgoliaError(error)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, {
        extra: { source: 'algolia' },
      })
    })
  })

  describe('should capture non-ignored errors', () => {
    it('should capture a regular Error', () => {
      const error = new Error('Some unexpected error')

      captureAlgoliaError(error)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, {
        extra: { source: 'algolia' },
      })
    })

    it('should capture error with unrelated name', () => {
      const error = new Error('Something went wrong')
      error.name = 'CustomAlgoliaError'

      captureAlgoliaError(error)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, {
        extra: { source: 'algolia' },
      })
    })

    it('should capture error with unrelated message', () => {
      const error = new Error('Unauthorized access')

      captureAlgoliaError(error)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, {
        extra: { source: 'algolia' },
      })
    })

    it('should capture TypeError', () => {
      const error = new TypeError('Cannot read property of undefined')

      captureAlgoliaError(error)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, {
        extra: { source: 'algolia' },
      })
    })
  })
})
