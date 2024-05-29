import * as API from 'api/api'
import { OauthStateResponse } from 'api/gen'
import { useOAuthState } from 'features/auth/api/useOAuthState'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const apiOAuthStateSpy = jest.spyOn(API.api, 'getNativeV1OauthState')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('libs/network/NetInfoWrapper')

describe('useOAuthState', () => {
  it('should not fetch oauth state when FF is disabled', async () => {
    const { result } = renderOAuthState()

    expect(apiOAuthStateSpy).not.toHaveBeenCalled()
    expect(result.current.data).toBeUndefined()
  })

  it('should fetch oauth state when FF is enabled', async () => {
    mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
      oauthStateToken: 'oauth_state_token',
    })
    useFeatureFlagSpy.mockReturnValueOnce(true)

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
