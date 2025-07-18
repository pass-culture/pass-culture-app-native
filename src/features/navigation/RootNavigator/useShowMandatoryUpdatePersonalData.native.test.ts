import { reset } from '__mocks__/@react-navigation/native'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as RemoteConfig from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

import { useShowMandatoryUpdatePersonalData } from './useShowMandatoryUpdatePersonalData'

const mockUseAuthContext = jest.fn().mockReturnValue({ user: beneficiaryUser, isLoggedIn: true })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const useRemoteConfigSpy = jest.spyOn(RemoteConfig, 'useRemoteConfigQuery')
useRemoteConfigSpy.mockReturnValue({
  ...remoteConfigResponseFixture,
  data: { ...DEFAULT_REMOTE_CONFIG, displayMandatoryUpdatePersonalData: true },
})

describe('useShowMandatoryUpdatePersonalData', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_MANDATORY_UPDATE_PERSONAL_DATA])
  })

  it('should navigates to MandatoryUpdatePersonalData when all conditions are met', () => {
    renderHook(() => useShowMandatoryUpdatePersonalData(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'MandatoryUpdatePersonalData' }],
    })
  })

  it('should not navigate when displayMandatoryUpdatePersonalData is false', () => {
    useRemoteConfigSpy.mockReturnValueOnce({
      ...remoteConfigResponseFixture,
      data: { ...DEFAULT_REMOTE_CONFIG, displayMandatoryUpdatePersonalData: false },
    })

    renderHook(() => useShowMandatoryUpdatePersonalData(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(reset).not.toHaveBeenCalled()
  })

  it('should not navigate when user is undefined', () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      user: undefined,
    })

    renderHook(() => useShowMandatoryUpdatePersonalData(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(reset).not.toHaveBeenCalled()
  })

  it('should not navigate when user is not logged in', () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
      user: beneficiaryUser,
    })

    renderHook(() => useShowMandatoryUpdatePersonalData(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(reset).not.toHaveBeenCalled()
  })

  it('should not navigate when the feature flag is disabled', () => {
    setFeatureFlags()

    renderHook(() => useShowMandatoryUpdatePersonalData(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(reset).not.toHaveBeenCalled()
  })
})
