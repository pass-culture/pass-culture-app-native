import { getFeatureFlag } from 'libs/firebase/firestore/featureFlags/getFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { renderHook } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

describe('getFeatureFlag', () => {
  it.each([
    RemoteStoreFeatureFlags.FAV_LIST_FAKE_DOOR,
    RemoteStoreFeatureFlags.WIP_CINEMA_OFFER_VENUE_BLOCK,
    RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW,
    RemoteStoreFeatureFlags.WIP_DISPLAY_SEARCH_NB_FACET_RESULTS,
    RemoteStoreFeatureFlags.WIP_ENABLE_APP_LOCATION,
    RemoteStoreFeatureFlags.WIP_ENABLE_EMAIL_VALIDATION_RESEND,
    RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO,
    RemoteStoreFeatureFlags.WIP_ENABLE_GTL_PLAYLISTS_IN_BOOKSTORE_VENUES,
    RemoteStoreFeatureFlags.WIP_OFFER_V2,
    RemoteStoreFeatureFlags.WIP_SAME_ARTIST_PLAYLIST,
    RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE,
    RemoteStoreFeatureFlags.WIP_NEW_MAPPING_BOOKS,
  ])(
    'should call the right firestore collection: featureFlags',
    (featureFlag: RemoteStoreFeatureFlags) => {
      renderHook(() => getFeatureFlag(featureFlag))

      expect(collection).toHaveBeenCalledWith('featureFlags')
    }
  )
})
