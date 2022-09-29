import { startTracking } from 'features/cookies/helpers/startTracking'
import { amplitude } from 'libs/amplitude'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { Batch } from 'libs/react-native-batch'

describe('startTracking', () => {
  it('should disable tracking if enabled = false', () => {
    startTracking(false)

    expect(amplitude.disableCollection).toHaveBeenCalled()
    expect(analytics.disableCollection).toHaveBeenCalled()
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(false)
    expect(Batch.optOut).toHaveBeenCalled()
  })

  it('should enable tracking if enabled = true', () => {
    startTracking(true)

    expect(amplitude.enableCollection).toHaveBeenCalled()
    expect(analytics.enableCollection).toHaveBeenCalled()
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
    expect(Batch.optIn).toHaveBeenCalled()
  })
})
