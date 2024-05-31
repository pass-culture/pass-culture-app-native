import { useGetAllFeatureFlags } from 'libs/firebase/firestore/featureFlags/useGetAllFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import firestore from 'libs/firebase/shims/firestore'
import { getAppBuildVersion } from 'libs/packageJson'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const buildVersion = getAppBuildVersion()

jest.mock('libs/monitoring')
jest.mock('@react-native-firebase/firestore')

const { collection } = firestore()

const mockGet = jest.fn()

const featureFlagKey = 'WIP_DISABLE_STORE_REVIEW'
const featureFlag = RemoteStoreFeatureFlags[featureFlagKey]

describe('useGetAllFeatureFlags', () => {
  beforeAll(() =>
    collection(featureFlag)
      .doc('testing')
      // @ts-expect-error is a mock
      .get.mockResolvedValue({
        get: mockGet,
      })
  )

  it('should deactivate FF when no build number is given', async () => {
    const firestoreData = { maximalBuildNumber: buildVersion + 1 }
    mockGet.mockReturnValue(firestoreData).mockReturnValueOnce(firestoreData)

    const { result } = renderGetAllFeatureFlags()

    await act(async () => {})

    expect(result.current[featureFlagKey]).toBeTruthy()
  })
})

const renderGetAllFeatureFlags = () =>
  renderHook(() => useGetAllFeatureFlags(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
