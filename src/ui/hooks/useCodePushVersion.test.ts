import CodePush, { LocalPackage } from 'react-native-code-push'

import { eventMonitoring } from 'libs/monitoring'
import { renderHook, waitFor } from 'tests/utils'

import { useCodePushVersion } from './useCodePushVersion'

describe('useCodePushVersion', () => {
  it('returns empty string if CodePush.getUpdateMetadata returns null', async () => {
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve(null))

    const { result } = renderHook(() => useCodePushVersion())

    expect(result.current).toEqual('')
  })

  it('returns version label if CodePush.getUpdateMetadata returns metadata', async () => {
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve({ label: 'V4' } as LocalPackage))

    const { result } = renderHook(() => useCodePushVersion())
    await waitFor(() => {
      expect(result.current).toEqual('V4')
    })
  })

  it('calls eventMonitoring.captureException on error', async () => {
    const error = new Error('CodePush error')
    CodePush.getUpdateMetadata = jest.fn(() => Promise.reject(error))
    renderHook(() => useCodePushVersion())

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
    })
  })
})
