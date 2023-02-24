import { TrackingStatus } from 'react-native-tracking-transparency'

import { campaignTracker, CampaignEvents } from 'libs/campaign'
import { logOpenAppRef, logOpenApp } from 'libs/campaign/logOpenApp'
import { analytics } from 'libs/firebase/analytics'

const acceptedTracking: TrackingStatus[] = ['unavailable', 'authorized']
const refusedTracking: TrackingStatus[] = ['denied', 'restricted', 'not-determined']

describe('logOpenApp', () => {
  beforeEach(() => {
    logOpenAppRef.hasLoggedOpenApp = false
  })

  it.each(acceptedTracking)('should log open app event when status is %s', async (status) => {
    await logOpenApp(status)
    expect(campaignTracker.logEvent).toHaveBeenNthCalledWith(1, CampaignEvents.OPEN_APP, {
      af_firebase_pseudo_id: await analytics.getAppInstanceId(),
    })
  })

  it.each(refusedTracking)('should not log open event when status is %s', async (status) => {
    await logOpenApp(status)
    expect(campaignTracker.logEvent).not.toHaveBeenCalled()
  })

  it.each(acceptedTracking)(
    'should not log open app event twice in same session',
    async (status) => {
      await logOpenApp(status)
      await logOpenApp(status)

      expect(campaignTracker.logEvent).toHaveBeenNthCalledWith(1, CampaignEvents.OPEN_APP, {
        af_firebase_pseudo_id: await analytics.getAppInstanceId(),
      })
    }
  )
})
