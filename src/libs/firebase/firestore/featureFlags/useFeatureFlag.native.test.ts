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

const featureFlag = RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW

describe('useFeatureFlag', () => {
  beforeAll(() =>
    collection(featureFlag)
      .doc('testing')
      // @ts-expect-error is a mock
      .get.mockResolvedValue({
        get: mockGet,
      })
  )

  it('should deactivate FF when no build number is given', async () => {
    const firestoreData = {}
    mockGet.mockReturnValueOnce(firestoreData)

    const { result } = renderHook(() => useFeatureFlag(featureFlag))

    await act(async () => {})

    expect(result.current).toBeFalsy()
  })

  describe('minimalBuildNumber', () => {
    it.each`
      firebaseFeatureFlag | minimalBuildNumber  | expected
      ${false}            | ${buildVersion + 1} | ${'disabled when build number is below firestore minimalBuildNumber'}
      ${true}             | ${buildVersion}     | ${'enabled when build number is equal to firestore minimalBuildNumber'}
      ${true}             | ${buildVersion - 1} | ${'enabled when build number is greater than firestore minimalBuildNumber'}
    `(
      `should be $expected`,
      async ({
        firebaseFeatureFlag,
        minimalBuildNumber,
      }: {
        firebaseFeatureFlag?: boolean
        minimalBuildNumber?: number
      }) => {
        const firestoreData = { minimalBuildNumber }
        mockGet.mockReturnValueOnce(firestoreData)

        const { result } = renderHook(() => useFeatureFlag(featureFlag))

        await act(async () => {})

        expect(result.current).toBe(firebaseFeatureFlag)
      }
    )
  })

  describe('maximalBuildNumber', () => {
    it('should activate FF when version is below maximalBuildNumber', async () => {
      const firestoreData = { maximalBuildNumber: buildVersion + 1 }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderHook(() => useFeatureFlag(featureFlag))

      await act(async () => {})

      expect(result.current).toBeTruthy()
    })

    it('should activate FF when version is equal to maximalBuildNumber', async () => {
      const firestoreData = { maximalBuildNumber: buildVersion }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderHook(() => useFeatureFlag(featureFlag))

      await act(async () => {})

      expect(result.current).toBeTruthy()
    })

    it('should deactivate FF when version is greater than maximalBuildNumber', async () => {
      const firestoreData = { maximalBuildNumber: buildVersion - 1 }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderHook(() => useFeatureFlag(featureFlag))

      await act(async () => {})

      expect(result.current).toBeFalsy()
    })
  })
})
