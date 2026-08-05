import { getEnvironmentOverride } from 'libs/environment/envOverride/envOverride'
import { ENV_OVERRIDE_FIREBASE_CONFIG } from 'libs/environment/envOverride/envOverrideConfig'
import { REMOTE_CONFIG_FETCH_BASE_URL } from 'libs/firebase/remoteConfig/helpers/fetchOverriddenRemoteConfig'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { eventMonitoring } from 'libs/monitoring/services'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const mockGetConfigValues = jest.fn()
const mockRefresh = jest.fn()
jest.mock('libs/firebase/remoteConfig/remoteConfig.services', () => ({
  remoteConfig: {
    configure: () => Promise.resolve(true),
    refresh: () => mockRefresh(),
    getValues: () => mockGetConfigValues(),
  },
}))

jest.mock('libs/environment/envOverride/envOverride')
const mockGetEnvironmentOverride = jest.mocked(getEnvironmentOverride)

jest.useFakeTimers()

describe('useRemoteConfigQuery', () => {
  it('should return default remote config values when there is an error', async () => {
    mockRefresh.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useRemoteConfigQuery(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current.data).toEqual(DEFAULT_REMOTE_CONFIG))
  })

  it('should capture Sentry exception when there is an error', async () => {
    const error = new Error('Network error')
    mockRefresh.mockRejectedValueOnce(error)

    renderHook(() => useRemoteConfigQuery(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(async () => expect(eventMonitoring.captureException).toHaveBeenCalledTimes(1))
  })

  it('should fetch the target project remote config when an environment override is active', async () => {
    mockGetEnvironmentOverride.mockReturnValueOnce('production')
    const fetchUrl = `${REMOTE_CONFIG_FETCH_BASE_URL}/projects/${ENV_OVERRIDE_FIREBASE_CONFIG.production.FIREBASE_PROJECTID}/namespaces/firebase:fetch`
    mockServer.universalPost(fetchUrl, { entries: { homeEntryIdBeneficiary: 'prodEntryId' } })

    const { result } = renderHook(() => useRemoteConfigQuery(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current.data.homeEntryIdBeneficiary).toEqual('prodEntryId'))

    expect(mockRefresh).not.toHaveBeenCalled()
  })
})
