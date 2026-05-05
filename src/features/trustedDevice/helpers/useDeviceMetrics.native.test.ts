import DeviceInfo from 'react-native-device-info'

import { useDeviceMetrics } from 'features/trustedDevice/helpers/useDeviceMetrics'
import { DeviceMetrics } from 'features/trustedDevice/types'
import { act, renderHook } from 'tests/utils'

jest.mock('react-native-device-info')
jest.mock('libs/react-native-device-info/getDeviceId')

const RESOLUTION_WIDTH = 700
const RESOLUTION_HEIGHT = 1000
const mockUseWindowDimensions = jest.fn().mockReturnValue({
  width: RESOLUTION_WIDTH,
  height: RESOLUTION_HEIGHT,
})
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: mockUseWindowDimensions,
}))

const getfontScaleSpy = jest.spyOn(DeviceInfo, 'getFontScale').mockResolvedValueOnce(1.5)

describe('useDeviceMetrics', () => {
  beforeEach(() => getfontScaleSpy.mockResolvedValueOnce(1.5))

  it('returns device metrics', async () => {
    const { result } = renderHook(useDeviceMetrics)

    const expectedInfo: DeviceMetrics = {
      resolution: '700x1000',
      fontScale: 1.5,
      screenZoomLevel: undefined,
    }
    await act(async () => {})

    expect(result.current).toMatchObject(expectedInfo)
  })
})
