import { Linking } from 'react-native'

import { eventMonitoring } from 'libs/monitoring'
import { waitFor, renderHook } from 'tests/utils'

import { useIsMailAppAvailableIOS } from './useIsMailAppAvailableIOS'

const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL')

describe('useIsMailAppAvailableIOS', () => {
  it('should set isMailAppAvailable to true when at least one mail app is available', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true)
    const { result } = renderUseIsMailAppAvailableIOS()

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should set isMailAppAvailable to false when no mail apps are available', async () => {
    canOpenURLSpy.mockResolvedValueOnce(false)
    const { result } = renderUseIsMailAppAvailableIOS()

    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  it("should log to sentry when can't check mail apps", async () => {
    const error = new Error('Error')
    canOpenURLSpy.mockRejectedValueOnce(error)
    renderUseIsMailAppAvailableIOS()

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        'Error checking mail app availability: Error: Error'
      )
    })
  })
})

const renderUseIsMailAppAvailableIOS = () => {
  return renderHook(() => useIsMailAppAvailableIOS())
}
