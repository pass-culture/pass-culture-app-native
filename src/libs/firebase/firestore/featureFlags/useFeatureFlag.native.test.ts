import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { act, renderHook } from 'tests/utils'

import { build } from '../../../../../package.json'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

const mockGet = jest.fn()

describe.each([
  RemoteStoreFeatureFlags.FAV_LIST_FAKE_DOOR,
  RemoteStoreFeatureFlags.WIP_CHANGE_EMAIL,
  RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW,
  RemoteStoreFeatureFlags.WIP_ENABLE_APP_LOCATION,
  RemoteStoreFeatureFlags.WIP_ENABLE_EMAIL_VALIDATION_RESEND,
  RemoteStoreFeatureFlags.WIP_ENABLE_GTL_PLAYLISTS_IN_BOOKSTORE_VENUES,
  RemoteStoreFeatureFlags.WIP_ENABLE_MULTIVENUE_OFFER,
  RemoteStoreFeatureFlags.WIP_ENABLE_TRUSTED_DEVICE,
  RemoteStoreFeatureFlags.WIP_ENABLE_NEW_EXCLUSIVITY_BLOCK,
  RemoteStoreFeatureFlags.WIP_ENABLE_VENUES_IN_SEARCH_RESULTS,
  RemoteStoreFeatureFlags.WIP_PRICES_BY_CATEGORIES,
  RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE,
])('useFeatureFlag %s', (featureFlag: RemoteStoreFeatureFlags) => {
  beforeAll(() =>
    collection(featureFlag)
      .doc('testing')
      // @ts-expect-error is a mock
      .get.mockResolvedValue({
        get: mockGet,
      })
  )
  it.each`
    firebaseFeatureFlag | minimalBuildNumber | expected
    ${false}            | ${undefined}       | ${'disabled when firestore minimalBuildNumber is undefined'}
    ${false}            | ${build + 1}       | ${'disabled when build number is below firestore minimalBuildNumber'}
    ${true}             | ${build}           | ${'enabled when build number is equal to firestore minimalBuildNumber'}
    ${true}             | ${build - 1}       | ${'enabled when build number is greater than firestore minimalBuildNumber'}
  `(
    `should be $expected`,
    async ({
      firebaseFeatureFlag,
      minimalBuildNumber,
    }: {
      firebaseFeatureFlag: boolean | undefined
      minimalBuildNumber: number | undefined
    }) => {
      const firestoreData = {
        minimalBuildNumber,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderHook(() => useFeatureFlag(featureFlag))

      await act(async () => {})
      expect(result.current).toBe(firebaseFeatureFlag)
    }
  )
})
