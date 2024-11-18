import { TrackingStatus } from 'react-native-tracking-transparency'

import { analytics } from 'libs/analytics'
import { campaignTracker, CampaignEvents } from 'libs/campaign'
import { logOpenAppRef, logOpenApp } from 'libs/campaign/logOpenApp'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'

const acceptedTracking: TrackingStatus[] = ['unavailable', 'authorized']
const refusedTracking: TrackingStatus[] = ['denied', 'restricted', 'not-determined']

jest.mock('libs/campaign')

describe('logOpenApp', () => {
  beforeEach(() => {
    logOpenAppRef.hasLoggedOpenApp = false
  })

  describe('for appsFlyer', () => {
    it.each(acceptedTracking)('should log open app event when status is %s', async (status) => {
      await logOpenApp(status)

      expect(campaignTracker.logEvent).toHaveBeenNthCalledWith(1, CampaignEvents.OPEN_APP, {
        af_firebase_pseudo_id: await firebaseAnalytics.getAppInstanceId(),
      })
    })

    it.each(refusedTracking)('should not log open event when status is %s', async (status) => {
      await logOpenApp(status)

      expect(campaignTracker.logEvent).not.toHaveBeenCalled()
    })
  })

  describe('for firebase', () => {
    it.each(acceptedTracking)('should log open app event when status is %s', async (status) => {
      await logOpenApp(status)

      expect(analytics.logOpenApp).toHaveBeenNthCalledWith(1, {
        appsFlyerUserId: 'uniqueCustomerId',
      })
    })

    it.each(refusedTracking)('should not log open event when status is %s', async (status) => {
      await logOpenApp(status)

      expect(analytics.logOpenApp).not.toHaveBeenCalled()
    })
  })

  it.each(acceptedTracking)(
    'should not log open app event twice in same session',
    async (status) => {
      await logOpenApp(status)
      await logOpenApp(status)

      expect(campaignTracker.logEvent).toHaveBeenNthCalledWith(1, CampaignEvents.OPEN_APP, {
        af_firebase_pseudo_id: await firebaseAnalytics.getAppInstanceId(),
      })
    }
  )
})
