import { getFeatureFlag } from 'libs/firebase/firestore/featureFlags/getFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { renderHook } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

describe('getFeatureFlag', () => {
  it.each([
    RemoteStoreFeatureFlags.DISABLE_OLD_CHANGE_EMAIL,
    RemoteStoreFeatureFlags.FAKE_DOOR_ARTIST,
    RemoteStoreFeatureFlags.WIP_CINEMA_OFFER_VENUE_BLOCK,
    RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW,
    RemoteStoreFeatureFlags.WIP_DISPLAY_SEARCH_NB_FACET_RESULTS,
    RemoteStoreFeatureFlags.WIP_ENABLE_EMAIL_VALIDATION_RESEND,
    RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO,
    RemoteStoreFeatureFlags.WIP_ENABLE_GTL_PLAYLISTS_IN_BOOKSTORE_VENUES,
    RemoteStoreFeatureFlags.WIP_OFFER_PREVIEW,
    RemoteStoreFeatureFlags.WIP_SAME_ARTIST_PLAYLIST,
    RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE,
    RemoteStoreFeatureFlags.WIP_NEW_MAPPING_BOOKS,
    RemoteStoreFeatureFlags.WIP_VENUE_MAP,
    RemoteStoreFeatureFlags.WIP_VENUE_MAP_SEARCH_RESULTS,
    RemoteStoreFeatureFlags.WIP_VENUE_MAP_WITHOUT_PREVIEW,
    RemoteStoreFeatureFlags.WIP_SEARCH_ACCESSIBILITY_FILTER,
    RemoteStoreFeatureFlags.WIP_ENABLE_NEW_XP_CINE_FROM_OFFER,
    RemoteStoreFeatureFlags.WIP_ENABLE_NEW_CHANGE_EMAIL,
  ])(
    'should call the right firestore collection: featureFlags',
    (featureFlag: RemoteStoreFeatureFlags) => {
      renderHook(() => getFeatureFlag(featureFlag))

      expect(collection).toHaveBeenCalledWith('featureFlags')
    }
  )
})
