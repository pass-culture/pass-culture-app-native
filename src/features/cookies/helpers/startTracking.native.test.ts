/* eslint-disable no-restricted-imports */
import { startTracking } from 'features/cookies/helpers/startTracking'
import { campaignTracker } from 'libs/campaign'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { Batch } from 'libs/react-native-batch'

jest.mock('libs/campaign')

jest.mock('libs/firebase/analytics/analytics')

describe('startTracking', () => {
  it('should disable tracking if enabled = false', () => {
    startTracking(false)

    expect(firebaseAnalytics.disableCollection).toHaveBeenCalledTimes(1)
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(false)
    expect(Batch.optOut).toHaveBeenCalledTimes(1)
  })

  it('should enable tracking if enabled = true', () => {
    startTracking(true)

    expect(firebaseAnalytics.enableCollection).toHaveBeenCalledTimes(1)
    expect(campaignTracker.init).toHaveBeenCalledWith(true)
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
    expect(Batch.optIn).toHaveBeenCalledTimes(1)
  })
})
