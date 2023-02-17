import { getFeatureFlag } from 'libs/firebase/firestore/featureFlags/getFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { renderHook } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

describe('getFeatureFlag', () => {
  it.each([
    RemoteStoreFeatureFlags.FAV_LIST_FAKE_DOOR,
    RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW,
    RemoteStoreFeatureFlags.WIP_PRICES_BY_CATEGORIES,
  ])(
    'should call the right firestore collection: featureFlags',
    (featureFlag: RemoteStoreFeatureFlags) => {
      renderHook(() => getFeatureFlag(featureFlag))

      expect(collection).toHaveBeenCalledWith('featureFlags')
    }
  )
})
