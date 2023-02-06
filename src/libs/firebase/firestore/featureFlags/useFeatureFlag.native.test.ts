import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { renderHook, waitFor } from 'tests/utils'

import { build } from '../../../../../package.json'

jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

const mockGet = jest.fn()

describe.each([
  RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW,
  RemoteStoreFeatureFlags.WIP_PRICES_BY_CATEGORIES,
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

      await waitFor(() => {
        expect(result.current).toBe(firebaseFeatureFlag)
      })
    }
  )
})
