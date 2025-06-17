import * as perf from '@react-native-firebase/perf'
import { Platform } from 'react-native'

import { eventMonitoring } from 'libs/monitoring/services'
import { useScreenRenderOnFocus } from 'performance/useScreenRenderOnFocus'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/monitoring/services')

const mockStart = jest.fn()
const mockPerf = jest.fn().mockReturnValue({ startScreenTrace: mockStart })
jest.spyOn(perf, 'default').mockImplementation(mockPerf)

jest.spyOn(Platform, 'select').mockImplementation((spec) => spec)
Object.defineProperty(Platform, 'OS', { writable: true })
Object.defineProperty(Platform, 'Version', { writable: true })

describe('useScreenRenderOnFocus', () => {
  it('should start a screen trace', () => {
    renderHook(() => useScreenRenderOnFocus('Test'))

    expect(mockStart).toHaveBeenCalledTimes(1)
  })

  it('should log error if there is an issue and user is on Android (other than 28)', async () => {
    Platform.OS = 'android'
    Platform.Version = 29

    const error = new Error('some error')
    mockStart.mockRejectedValueOnce(error)
    renderHook(() => useScreenRenderOnFocus('Test'))

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
    })
  })

  it('should not log error if there is an issue on iOS', async () => {
    Platform.OS = 'ios'
    Platform.Version = 29

    const error = new Error('some error')
    mockStart.mockRejectedValueOnce(error)
    renderHook(() => useScreenRenderOnFocus('Test'))

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
    })
  })
})
