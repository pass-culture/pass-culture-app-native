import { getFeatureFlag } from 'libs/firebase/firestore/featureFlags/getFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { renderHook } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

describe('getFeatureFlag', () => {
  it.each([
    RemoteStoreFeatureFlags.FAV_LIST_FAKE_DOOR,
    RemoteStoreFeatureFlags.WIP_CHANGE_EMAIL,
    RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW,
    RemoteStoreFeatureFlags.WIP_ENABLE_MULTIVENUE_OFFER,
    RemoteStoreFeatureFlags.WIP_ENABLE_TRUSTED_DEVICE,
    RemoteStoreFeatureFlags.WIP_ENABLE_NEW_EXCLUSIVITY_BLOCK,
    RemoteStoreFeatureFlags.WIP_PRICES_BY_CATEGORIES,
    RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE,
  ])(
    'should call the right firestore collection: featureFlags',
    (featureFlag: RemoteStoreFeatureFlags) => {
      renderHook(() => getFeatureFlag(featureFlag))

      expect(collection).toHaveBeenCalledWith('featureFlags')
    }
  )
})
