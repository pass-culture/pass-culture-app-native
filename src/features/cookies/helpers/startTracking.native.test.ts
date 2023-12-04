/* eslint-disable no-restricted-imports */
import { startTracking } from 'features/cookies/helpers/startTracking'
import { amplitude } from 'libs/amplitude'
import { campaignTracker } from 'libs/campaign'
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { Batch } from 'libs/react-native-batch'

describe('startTracking', () => {
  it('should disable tracking if enabled = false', () => {
    startTracking(false)

    expect(amplitude.disableCollection).toHaveBeenCalledTimes(1)
    expect(firebaseAnalytics.disableCollection).toHaveBeenCalledTimes(1)
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(false)
    expect(Batch.optOut).toHaveBeenCalledTimes(1)
  })

  it('should enable tracking if enabled = true', () => {
    startTracking(true)

    expect(amplitude.enableCollection).toHaveBeenCalledTimes(1)
    expect(firebaseAnalytics.enableCollection).toHaveBeenCalledTimes(1)
    expect(campaignTracker.init).toHaveBeenCalledWith(true)
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
    expect(Batch.optIn).toHaveBeenCalledTimes(1)
  })
})
