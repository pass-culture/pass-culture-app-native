import { startTracking } from 'features/cookies/startTracking'
import { analytics } from 'libs/firebase/analytics'

const mockDisableCollection = jest.fn()
const mockEnableCollection = jest.fn()
jest.mock('libs/amplitude', () => ({
  amplitude: () => ({
    disableCollection: mockDisableCollection,
    enableCollection: mockEnableCollection,
  }),
}))

describe('startTracking', () => {
  it('should disable tracking if enabled = false', () => {
    startTracking(false)

    expect(mockDisableCollection).toHaveBeenCalled()
    expect(analytics.disableCollection).toHaveBeenCalled()
  })

  it('should enabled tracking if enabled = true', () => {
    startTracking(true)
    expect(mockEnableCollection).toHaveBeenCalled()
    expect(analytics.enableCollection).toHaveBeenCalled()
  })
})
