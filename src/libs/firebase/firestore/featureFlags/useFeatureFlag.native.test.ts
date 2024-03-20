import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { eventMonitoring } from 'libs/monitoring'
import { getAppBuildVersion } from 'libs/packageJson'
import { act, renderHook } from 'tests/utils'

const buildVersion = getAppBuildVersion()

jest.mock('libs/monitoring')
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
        firebaseFeatureFlag: boolean
        minimalBuildNumber: number
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

  describe('maximal and minimal build numbers', () => {
    it('should activate FF when version is between minimalBuildNumber and maximalBuildNumber', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion - 1,
        maximalBuildNumber: buildVersion + 1,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderHook(() => useFeatureFlag(featureFlag))

      await act(async () => {})

      expect(result.current).toBeTruthy()
    })

    it('should activate FF when minimalBuildNumber and maximalBuildNumber are equal to current version', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion,
        maximalBuildNumber: buildVersion,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderHook(() => useFeatureFlag(featureFlag))

      await act(async () => {})

      expect(result.current).toBeTruthy()
    })

    it('should deactivate FF when minimalBuildNumber and maximalBuildNumber are equal and below current version', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion - 1,
        maximalBuildNumber: buildVersion - 1,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderHook(() => useFeatureFlag(featureFlag))

      await act(async () => {})

      expect(result.current).toBeFalsy()
    })

    it('should deactivate FF when minimalBuildNumber and maximalBuildNumber are equal and greater than current version', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion + 1,
        maximalBuildNumber: buildVersion + 1,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderHook(() => useFeatureFlag(featureFlag))

      await act(async () => {})

      expect(result.current).toBeFalsy()
    })

    it('should deactivate FF when minimalBuildNumber is greater than maximalBuildNumber', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion + 1,
        maximalBuildNumber: buildVersion,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderHook(() => useFeatureFlag(featureFlag))

      await act(async () => {})

      expect(result.current).toBeFalsy()
    })

    it('should log to sentry when minimalBuildNumber is greater than maximalBuildNumber', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion + 1,
        maximalBuildNumber: buildVersion,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      renderHook(() => useFeatureFlag(featureFlag))

      await act(async () => {})

      expect(eventMonitoring.logInfo).toHaveBeenCalledWith(
        `Minimal build number is greater than maximal build number for feature flag ${featureFlag}`,
        { extra: firestoreData }
      )
    })
  })
})
