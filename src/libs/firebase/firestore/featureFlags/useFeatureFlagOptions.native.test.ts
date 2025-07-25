import { useFeatureFlagOptions } from 'libs/firebase/firestore/featureFlags/useFeatureFlagOptions'
import {
  FIRESTORE_ROOT_COLLECTION,
  RemoteStoreDocuments,
  RemoteStoreFeatureFlags,
} from 'libs/firebase/firestore/types'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import firestore from 'libs/firebase/shims/firestore'
import { eventMonitoring } from 'libs/monitoring/services'
import { getAppBuildVersion } from 'libs/packageJson'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const buildVersion = getAppBuildVersion()

jest.mock('libs/monitoring/services')
jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

const mockGet = jest.fn()

const featureFlag = RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW
const useRemoteConfigSpy = jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(DEFAULT_REMOTE_CONFIG)

//TODO(PC-35000): unskip this test
describe.skip('useFeatureFlagOptions', () => {
  beforeAll(() =>
    collection(FIRESTORE_ROOT_COLLECTION)
      .doc(RemoteStoreDocuments.FEATURE_FLAGS)
      // @ts-expect-error is a mock
      .get.mockResolvedValue({
        get: mockGet,
      })
  )

  it('should deactivate FF when no build number is given', async () => {
    const firestoreData = {}
    mockGet.mockReturnValueOnce(firestoreData)

    const { result } = renderUseFeatureFlag(featureFlag)

    await act(async () => {})

    expect(result.current.isFeatureFlagActive).toBeFalsy()
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

        const { result } = renderUseFeatureFlag(featureFlag)

        await act(async () => {})

        expect(result.current.isFeatureFlagActive).toBe(firebaseFeatureFlag)
      }
    )
  })

  describe('maximalBuildNumber', () => {
    it('should activate FF when version is below maximalBuildNumber', async () => {
      const firestoreData = { maximalBuildNumber: buildVersion + 1 }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderUseFeatureFlag(featureFlag)

      await act(async () => {})

      expect(result.current.isFeatureFlagActive).toBeTruthy()
    })

    it('should activate FF when version is equal to maximalBuildNumber', async () => {
      const firestoreData = { maximalBuildNumber: buildVersion }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderUseFeatureFlag(featureFlag)

      await act(async () => {})

      expect(result.current).toBeTruthy()
    })

    it('should deactivate FF when version is greater than maximalBuildNumber', async () => {
      const firestoreData = { maximalBuildNumber: buildVersion - 1 }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderUseFeatureFlag(featureFlag)

      await act(async () => {})

      expect(result.current.isFeatureFlagActive).toBeFalsy()
    })
  })

  describe('maximal and minimal build numbers', () => {
    it('should activate FF when version is between minimalBuildNumber and maximalBuildNumber', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion - 1,
        maximalBuildNumber: buildVersion + 1,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderUseFeatureFlag(featureFlag)

      await act(async () => {})

      expect(result.current.isFeatureFlagActive).toBeTruthy()
    })

    it('should activate FF when minimalBuildNumber and maximalBuildNumber are equal to current version', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion,
        maximalBuildNumber: buildVersion,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderUseFeatureFlag(featureFlag)

      await act(async () => {})

      expect(result.current).toBeTruthy()
    })

    it('should deactivate FF when minimalBuildNumber and maximalBuildNumber are equal and below current version', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion - 1,
        maximalBuildNumber: buildVersion - 1,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderUseFeatureFlag(featureFlag)

      await act(async () => {})

      expect(result.current.isFeatureFlagActive).toBeFalsy()
    })

    it('should deactivate FF when minimalBuildNumber and maximalBuildNumber are equal and greater than current version', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion + 1,
        maximalBuildNumber: buildVersion + 1,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderUseFeatureFlag(featureFlag)

      await act(async () => {})

      expect(result.current.isFeatureFlagActive).toBeFalsy()
    })

    it('should deactivate FF when minimalBuildNumber is greater than maximalBuildNumber', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion + 1,
        maximalBuildNumber: buildVersion,
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderUseFeatureFlag(featureFlag)

      await act(async () => {})

      expect(result.current.isFeatureFlagActive).toBeFalsy()
    })

    describe('When shouldLogInfo remote config is false', () => {
      beforeAll(() => {
        useRemoteConfigSpy.mockReturnValue({
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: false,
        })
      })

      it('should not log to sentry when minimalBuildNumber is greater than maximalBuildNumber', async () => {
        const firestoreData = {
          minimalBuildNumber: buildVersion + 1,
          maximalBuildNumber: buildVersion,
        }
        mockGet.mockReturnValueOnce(firestoreData)

        renderUseFeatureFlag(featureFlag)

        await act(async () => {})

        expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
      })
    })

    describe('When shouldLogInfo remote config is true', () => {
      beforeAll(() => {
        useRemoteConfigSpy.mockReturnValue({
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: true,
        })
      })

      afterAll(() => {
        useRemoteConfigSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
      })

      it('should log to sentry when minimalBuildNumber is greater than maximalBuildNumber', async () => {
        const firestoreData = {
          minimalBuildNumber: buildVersion + 1,
          maximalBuildNumber: buildVersion,
        }
        mockGet.mockReturnValueOnce(firestoreData)

        renderUseFeatureFlag(featureFlag)

        await act(async () => {})

        expect(eventMonitoring.captureException).toHaveBeenCalledWith(
          `Minimal build number is greater than maximal build number for feature flag ${featureFlag}`,
          { level: 'info', extra: firestoreData }
        )
      })
    })
  })

  describe('other data', () => {
    it('should include owner squad and options when included', async () => {
      const firestoreData = {
        minimalBuildNumber: buildVersion + 1,
        maximalBuildNumber: buildVersion,
        owner: 'activation',
        options: {
          option1: 'value1',
        },
      }
      mockGet.mockReturnValueOnce(firestoreData)

      const { result } = renderUseFeatureFlag(featureFlag)

      await act(async () => {})

      expect(result.current.options).toEqual({ option1: 'value1' })
      expect(result.current.owner).toEqual('activation')
    })
  })
})

const renderUseFeatureFlag = (featureFlag: RemoteStoreFeatureFlags) =>
  renderHook(() => useFeatureFlagOptions(featureFlag), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
