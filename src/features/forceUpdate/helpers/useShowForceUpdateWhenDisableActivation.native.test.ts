import { useShowForceUpdateWhenDisableActivation } from 'features/forceUpdate/helpers/useShowForceUpdateWhenDisableActivation'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { renderHook } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('useShowForceUpdateWhenDisableActivation', () => {
  it('does not throw an error when feature flag disableActivation is disable', () => {
    setFeatureFlags()
    const { result } = renderHook(() => useShowForceUpdateWhenDisableActivation())

    expect(result.current).toBeUndefined()
  })

  it('throws a ScreenError when feature flag disableActivation is enable', () => {
    // We allow this console error because useShowForceUpdateWhenDisableActivation throwing an error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)
    setFeatureFlags([RemoteStoreFeatureFlags.DISABLE_ACTIVATION])

    expect(() => {
      renderHook(() => useShowForceUpdateWhenDisableActivation())
    }).toThrow(new Error('Must update app'))
  })
})
