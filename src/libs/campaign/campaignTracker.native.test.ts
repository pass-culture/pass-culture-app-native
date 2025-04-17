import appsFlyer from 'react-native-appsflyer'
import * as TrackingTransparency from 'react-native-tracking-transparency'

import { campaignTracker } from 'libs/campaign/campaignTracker'
import * as TrackingConsent from 'libs/trackingConsent/requestIdfaTrackingConsent'
import { waitFor } from 'tests/utils'

const requestIDFATrackingConsentSpy = jest.spyOn(TrackingConsent, 'requestIDFATrackingConsent')
const getTrackingStatusSpy = jest
  .spyOn(TrackingTransparency, 'getTrackingStatus')
  .mockResolvedValue('authorized')

jest.mock('libs/firebase/analytics/analytics')

describe('campaignTracker', () => {
  it('should not request ATT when init parameter is false', async () => {
    campaignTracker.init(false)

    expect(requestIDFATrackingConsentSpy).not.toHaveBeenCalled()
  })

  it('should request ATT when init parameter is true', async () => {
    campaignTracker.init(true)

    expect(requestIDFATrackingConsentSpy).toHaveBeenCalledTimes(1)
  })

  it('should store user consent when cookie consent and tracking consent have been accepted', async () => {
    campaignTracker.init(true)
    await waitFor(() => {
      expect(appsFlyer.setConsentData).toHaveBeenCalledWith({
        isUserSubjectToGDPR: true,
        hasConsentForAdsPersonalization: true,
        hasConsentForDataUsage: true,
        hasConsentForAdStorage: false,
      })
    })
  })

  it('should store user consent when cookie consent has been accepted but tracking consent has been denied', async () => {
    getTrackingStatusSpy.mockResolvedValueOnce('denied')

    campaignTracker.init(true)

    await waitFor(() => {
      expect(appsFlyer.setConsentData).toHaveBeenCalledWith({
        isUserSubjectToGDPR: true,
        hasConsentForAdsPersonalization: false,
        hasConsentForDataUsage: true,
        hasConsentForAdStorage: false,
      })
    })
  })
})
