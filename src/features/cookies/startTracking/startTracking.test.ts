import { startTracking } from 'features/cookies/startTracking/startTracking'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { Batch } from 'libs/react-native-batch'

const mockDisableAmplitudeCollection = jest.fn()
const mockEnableAmplitudeCollection = jest.fn()

jest.mock('libs/amplitude', () => ({
  amplitude: () => ({
    disableCollection: mockDisableAmplitudeCollection,
    enableCollection: mockEnableAmplitudeCollection,
  }),
}))

describe('startTracking', () => {
  it('should disable tracking if enabled = false', () => {
    startTracking(false)

    expect(mockDisableAmplitudeCollection).toHaveBeenCalled()
    expect(analytics.disableCollection).toHaveBeenCalled()
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(false)
    expect(Batch.optOut).toHaveBeenCalled()
  })

  it('should enabled tracking if enabled = true', () => {
    startTracking(true)

    expect(mockEnableAmplitudeCollection).toHaveBeenCalled()
    expect(analytics.enableCollection).toHaveBeenCalled()
    expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
    expect(Batch.optIn).toHaveBeenCalled()
  })
})
