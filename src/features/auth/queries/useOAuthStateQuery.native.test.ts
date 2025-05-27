import * as API from 'api/api'
import { OauthStateResponse } from 'api/gen'
import { useOAuthStateQuery } from 'features/auth/queries/useOAuthStateQuery'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const apiOAuthStateSpy = jest.spyOn(API.api, 'getNativeV1OauthState')

jest.mock('libs/network/NetInfoWrapper')

describe('useOAuthStateQuery', () => {
  it('should not fetch oauth state when disabled', async () => {
    setFeatureFlags()
    const { result } = renderOAuthState(false)

    expect(apiOAuthStateSpy).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })

  it('should fetch oauth state when FF is enabled', async () => {
    mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
      oauthStateToken: 'oauth_state_token',
    })

    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO])
    const { result } = renderOAuthState()

    await act(async () => {})
    await act(async () => {})

    expect(result.current.data).toEqual({
      oauthStateToken: 'oauth_state_token',
    })
  })
})

const renderOAuthState = (enabled = true) =>
  renderHook(() => useOAuthStateQuery({ enabled }), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
