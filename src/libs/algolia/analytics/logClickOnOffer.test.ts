import AlgoliaSearchInsights from 'search-insights'

import { getAcceptedCookieConsent } from 'features/cookies/helpers/getAcceptedCookieConsent'
import { logClickOnOffer } from 'libs/algolia/analytics/logClickOnOffer'
import { captureMonitoringError } from 'libs/monitoring'

jest.mock('search-insights')
const mockAlgoliaSearchInsights = AlgoliaSearchInsights as jest.Mock

jest.mock('libs/monitoring')
const mockCaptureMonitoringError = captureMonitoringError as jest.Mock

jest.mock('features/cookies/helpers/getAcceptedCookieConsent')
const mockGetAcceptedCookieConsent = getAcceptedCookieConsent as jest.Mock
mockGetAcceptedCookieConsent.mockResolvedValue(true)

describe('logClickOnOffer', () => {
  it('should send the corresponding Algolia click event when called', async () => {
    await logClickOnOffer('abc123')({ objectID: 'object123', position: 0 })

    expect(mockAlgoliaSearchInsights).toHaveBeenCalledWith('clickedObjectIDsAfterSearch', {
      eventName: 'Offer Clicked',
      index: 'algoliaOffersIndexName',
      objectIDs: ['object123'],
      positions: [1],
      queryID: 'abc123',
    })
  })

  it('should raise a warning instead of sending an event when called without no queryID set', async () => {
    await logClickOnOffer()({ objectID: 'object123', position: 0 })

    expect(mockAlgoliaSearchInsights).not.toHaveBeenCalled()
    expect(mockCaptureMonitoringError).toHaveBeenCalledWith(
      'Algolia Analytics: useLogClickOnOffer called without any QueryID set'
    )
  })

  it("should not send an Algolia click event when user didn't accept cookies", async () => {
    mockGetAcceptedCookieConsent.mockResolvedValueOnce(false)

    await logClickOnOffer('abc123')({ objectID: 'object123', position: 0 })

    expect(mockAlgoliaSearchInsights).not.toHaveBeenCalled()
  })
})
