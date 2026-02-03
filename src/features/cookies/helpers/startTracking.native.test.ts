/* eslint-disable no-restricted-imports */
import { startTracking } from 'features/cookies/helpers/startTracking'
import { Adjust } from 'libs/adjust/adjust'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { Batch } from 'libs/react-native-batch'

jest.mock('libs/adjust/adjust')

jest.mock('libs/firebase/analytics/analytics')

describe('startTracking', () => {
  it('should disable tracking if enabled = false', () => {
    startTracking(false)

    expect(firebaseAnalytics.disableCollection).toHaveBeenCalledTimes(1)
    expect(Adjust.disable).toHaveBeenCalledTimes(1)
    expect(Batch.optOut).toHaveBeenCalledTimes(1)
  })

  it('should enable tracking if enabled = true', () => {
    startTracking(true)

    expect(firebaseAnalytics.enableCollection).toHaveBeenCalledTimes(1)
    expect(Adjust.initOrEnable).toHaveBeenCalledWith()
    expect(Batch.optIn).toHaveBeenCalledTimes(1)
  })
})
