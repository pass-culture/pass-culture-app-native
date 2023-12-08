import { Linking, Platform } from 'react-native'

import { eventMonitoring } from 'libs/monitoring'
import { waitFor, renderHook } from 'tests/utils'

import { useIsMailAppAvailable } from './useIsMailAppAvailable'

const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL')

const defaultPlatform = Platform.OS

describe('useIsMailAppAvailable', () => {
  afterAll(() => {
    Platform.OS = defaultPlatform
  })

  describe('on Android', () => {
    beforeAll(() => {
      Platform.OS = 'android'
    })

    it('should be true by default', () => {
      const { result } = renderUseIsMailAppAvailable()

      expect(result.current).toBe(true)
    })
  })

  describe('on iOS', () => {
    beforeAll(() => {
      Platform.OS = 'ios'
    })

    it('should be true when at least one mail app is available', async () => {
      canOpenURLSpy.mockResolvedValueOnce(true)
      const { result } = renderUseIsMailAppAvailable()

      await waitFor(() => {
        expect(result.current).toBe(true)
      })
    })

    it('should be false when no mail apps are available', async () => {
      canOpenURLSpy.mockResolvedValueOnce(false)
      const { result } = renderUseIsMailAppAvailable()

      await waitFor(() => {
        expect(result.current).toBe(false)
      })
    })

    it("should log to sentry when can't check mail apps", async () => {
      const error = new Error('Error')
      canOpenURLSpy.mockRejectedValueOnce(error)
      renderUseIsMailAppAvailable()

      await waitFor(() => {
        expect(eventMonitoring.captureException).toHaveBeenCalledWith(
          'Error checking mail app availability: Error: Error'
        )
      })
    })
  })
})

const renderUseIsMailAppAvailable = () => {
  return renderHook(useIsMailAppAvailable)
}
