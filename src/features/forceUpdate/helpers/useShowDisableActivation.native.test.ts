import { replace } from '__mocks__/@react-navigation/native'
import { useShowDisableActivation } from 'features/forceUpdate/helpers/useShowDisableActivation'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { renderHook } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('useShowForceUpdateWhenDisableActivation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('does nothing when feature flag disableActivation is disabled', () => {
    setFeatureFlags()
    renderHook(() => useShowDisableActivation())

    expect(replace).not.toHaveBeenCalled()
  })

  it('redirects to DisableActivation when feature flag disableActivation is enabled', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.DISABLE_ACTIVATION])
    renderHook(() => useShowDisableActivation())

    expect(replace).toHaveBeenCalledWith('DisableActivation')
  })
})
