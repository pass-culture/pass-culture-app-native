import AlgoliaSearchInsights from 'search-insights'

import { getAcceptedCookieConsent } from 'features/cookies/getAcceptedCookieConsent'
import { logClickOnOffer } from 'libs/algolia/analytics/logClickOnOffer'
import { captureMonitoringError } from 'libs/monitoring'
import { getCookiesConsent } from 'libs/trackingConsent/consent'

jest.mock('search-insights')
const mockAlgoliaSearchInsights = AlgoliaSearchInsights as jest.Mock

jest.mock('libs/monitoring')
const mockCaptureMonitoringError = captureMonitoringError as jest.Mock

jest.mock('libs/trackingConsent/consent')
const mockGetConsentToCookies = getCookiesConsent as jest.Mock
mockGetConsentToCookies.mockResolvedValue(true)

jest.mock('features/cookies/getAcceptedCookieConsent')
const mockGetAcceptedCookieConsent = getAcceptedCookieConsent as jest.Mock
mockGetAcceptedCookieConsent.mockResolvedValue(true)

let appEnableCookiesV2 = false

describe('logClickOnOffer', () => {
  // TODO(PC-17175): remove this describe
  describe('cookies consent V1', () => {
    it('should send the corresponding Algolia click event when called', async () => {
      await logClickOnOffer(appEnableCookiesV2, 'abc123')({ objectID: 'object123', position: 0 })

      expect(mockAlgoliaSearchInsights).toHaveBeenCalledWith('clickedObjectIDsAfterSearch', {
        eventName: 'Offer Clicked',
        index: 'algoliaOffersIndexName',
        objectIDs: ['object123'],
        positions: [1],
        queryID: 'abc123',
      })
    })

    it('should raise a warning instead of sending an event when called without no queryID set', async () => {
      await logClickOnOffer(appEnableCookiesV2)({ objectID: 'object123', position: 0 })

      expect(mockAlgoliaSearchInsights).not.toHaveBeenCalled()
      expect(mockCaptureMonitoringError).toHaveBeenCalledWith(
        'Algolia Analytics: useLogClickOnOffer called without any QueryID set'
      )
    })

    it("should not send an Algolia click event when user didn't accept cookies", async () => {
      mockGetConsentToCookies.mockResolvedValueOnce(false)

      await logClickOnOffer(appEnableCookiesV2, 'abc123')({ objectID: 'object123', position: 0 })

      expect(mockAlgoliaSearchInsights).not.toHaveBeenCalled()
    })
  })

  describe('cookies consent V2', () => {
    beforeEach(() => (appEnableCookiesV2 = true))

    it('should send the corresponding Algolia click event when called', async () => {
      await logClickOnOffer(appEnableCookiesV2, 'abc123')({ objectID: 'object123', position: 0 })

      expect(mockAlgoliaSearchInsights).toHaveBeenCalledWith('clickedObjectIDsAfterSearch', {
        eventName: 'Offer Clicked',
        index: 'algoliaOffersIndexName',
        objectIDs: ['object123'],
        positions: [1],
        queryID: 'abc123',
      })
    })

    it('should raise a warning instead of sending an event when called without no queryID set', async () => {
      await logClickOnOffer(appEnableCookiesV2)({ objectID: 'object123', position: 0 })

      expect(mockAlgoliaSearchInsights).not.toHaveBeenCalled()
      expect(mockCaptureMonitoringError).toHaveBeenCalledWith(
        'Algolia Analytics: useLogClickOnOffer called without any QueryID set'
      )
    })

    it("should not send an Algolia click event when user didn't accept cookies", async () => {
      mockGetAcceptedCookieConsent.mockResolvedValueOnce(false)

      await logClickOnOffer(appEnableCookiesV2, 'abc123')({ objectID: 'object123', position: 0 })

      expect(mockAlgoliaSearchInsights).not.toHaveBeenCalled()
    })
  })
})
