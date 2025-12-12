import AlgoliaSearchInsights from 'search-insights'

import { getAcceptedCookieConsent } from 'features/cookies/helpers/getAcceptedCookieConsent'
import { logClickOnVenue } from 'libs/algolia/analytics/logClickOnVenue'
import { captureMonitoringError } from 'libs/monitoring/errors'

jest.mock('search-insights')
const mockAlgoliaSearchInsights = jest.mocked(AlgoliaSearchInsights)

jest.mock('libs/monitoring/services')
jest.mock('libs/monitoring/errors')
const mockCaptureMonitoringError = jest.mocked(captureMonitoringError)

jest.mock('features/cookies/helpers/getAcceptedCookieConsent')
const mockGetAcceptedCookieConsent = jest.mocked(getAcceptedCookieConsent)
mockGetAcceptedCookieConsent.mockResolvedValue(true)

jest.mock('libs/firebase/analytics/analytics')

describe('logClickOnVenue', () => {
  it('should send the corresponding Algolia click event when called', async () => {
    await logClickOnVenue({ objectID: 'object123', position: 0, queryID: 'abc123' })

    expect(mockAlgoliaSearchInsights).toHaveBeenCalledWith('clickedObjectIDsAfterSearch', {
      eventName: 'Venue Clicked',
      index: 'algoliaOffersIndexName',
      objectIDs: ['object123'],
      positions: [1],
      queryID: 'abc123',
    })
  })

  it('should raise a warning instead of sending an event when called without no queryID set', async () => {
    await logClickOnVenue({ objectID: 'object123', position: 0 })

    expect(mockAlgoliaSearchInsights).not.toHaveBeenCalled()
    expect(mockCaptureMonitoringError).toHaveBeenCalledWith(
      'Algolia Analytics: logClickOnVenue called without any QueryID set'
    )
  })

  it("should not send an Algolia click event when user didn't accept cookies", async () => {
    mockGetAcceptedCookieConsent.mockResolvedValueOnce(false)

    await logClickOnVenue({ objectID: 'object123', position: 0 })

    expect(mockAlgoliaSearchInsights).not.toHaveBeenCalled()
  })
})
