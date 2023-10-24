import CodePush, { LocalPackage } from 'react-native-code-push'

import { eventMonitoring } from 'libs/monitoring'
import { act, renderHook, waitFor } from 'tests/utils'

import { useVersion } from './useVersion'

describe('useVersion', () => {
  it('should return only the version when there are not CodePush information', async () => {
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve(null))

    const { result } = renderHook(() => useVersion())

    expect(result.current).toEqual('Version\u00A01.10.5')
  })

  it('should return version and CodePush label when there are CodePush information', async () => {
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve({ label: 'V4' } as LocalPackage))

    const { result } = renderHook(useVersion)

    await act(async () => {})

    expect(result.current).toEqual('Version\u00A01.10.5-4')
  })

  it('should capture a Sentry issue when there is an error', async () => {
    const error = new Error('CodePush error')
    CodePush.getUpdateMetadata = jest.fn(() => Promise.reject(error))
    renderHook(() => useVersion())

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
    })
  })
})
