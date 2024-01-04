import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import * as PackageJson from 'libs/packageJson'
import { act, renderHook } from 'tests/utils'

const buildVersion = 10010005
jest.spyOn(PackageJson, 'getAppBuildVersion').mockReturnValue(buildVersion)

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

const mockGet = jest.fn()

describe.each([
  RemoteStoreFeatureFlags.FAV_LIST_FAKE_DOOR,
  RemoteStoreFeatureFlags.WIP_CHANGE_EMAIL,
  RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW,
  RemoteStoreFeatureFlags.WIP_DISPLAY_SEARCH_NB_FACET_RESULTS,
  RemoteStoreFeatureFlags.WIP_ENABLE_APP_LOCATION,
  RemoteStoreFeatureFlags.WIP_ENABLE_EMAIL_VALIDATION_RESEND,
  RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO,
  RemoteStoreFeatureFlags.WIP_ENABLE_GTL_PLAYLISTS_IN_BOOKSTORE_VENUES,
  RemoteStoreFeatureFlags.WIP_ENABLE_MULTIVENUE_OFFER,
  RemoteStoreFeatureFlags.WIP_OFFER_V2,
  RemoteStoreFeatureFlags.WIP_PRICES_BY_CATEGORIES,
  RemoteStoreFeatureFlags.WIP_SAME_ARTIST_PLAYLIST,
  RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE,
  RemoteStoreFeatureFlags.WIP_NEW_MAPPING_BOOKS,
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
    firebaseFeatureFlag | minimalBuildNumber  | expected
    ${false}            | ${undefined}        | ${'disabled when firestore minimalBuildNumber is undefined'}
    ${false}            | ${buildVersion + 1} | ${'disabled when build number is below firestore minimalBuildNumber'}
    ${true}             | ${buildVersion}     | ${'enabled when build number is equal to firestore minimalBuildNumber'}
    ${true}             | ${buildVersion - 1} | ${'enabled when build number is greater than firestore minimalBuildNumber'}
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
