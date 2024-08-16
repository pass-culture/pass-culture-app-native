import { OauthStateResponse } from 'api/gen'
import { useOAuthState } from 'features/auth/api/useOAuthState'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

describe('useOAuthState', () => {
  it('should fetch oauth state when FF is enabled', async () => {
    mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
      oauthStateToken: 'oauth_state_token',
    })
    const { result } = renderOAuthState()

    await act(async () => {})

    expect(result.current.data).toEqual({
      oauthStateToken: 'oauth_state_token',
    })
  })
})

const renderOAuthState = () =>
  renderHook(useOAuthState, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
