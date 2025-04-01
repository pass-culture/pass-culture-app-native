import { act } from 'react-dom/test-utils'

import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { eventMonitoring } from 'libs/monitoring/services'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

const mockGetConfigValues = jest.fn()
const mockRefresh = jest.fn()
jest.mock('libs/firebase/remoteConfig/remoteConfig.services', () => ({
  remoteConfig: {
    configure: () => Promise.resolve(true),
    refresh: () => mockRefresh(),
    getValues: () => mockGetConfigValues(),
  },
}))

describe('useRemoteConfigQuery', () => {
  it('should return default remote config values when there is an error', async () => {
    mockRefresh.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useRemoteConfigQuery(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current).toEqual(DEFAULT_REMOTE_CONFIG)
  })

  it('should capture Sentry exception when there is an error', async () => {
    const error = new Error('Network error')
    mockRefresh.mockRejectedValueOnce(error)

    renderHook(() => useRemoteConfigQuery(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(eventMonitoring.captureException).toHaveBeenCalledTimes(1)
  })
})
