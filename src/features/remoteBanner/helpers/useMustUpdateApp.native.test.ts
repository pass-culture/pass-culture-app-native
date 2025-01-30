import * as useMinimalBuildNumber from 'features/remoteBanner/helpers/useMinimalBuildNumber'
import {
  mustUpdateAppState,
  useMustUpdateApp,
} from 'features/remoteBanner/helpers/useMustUpdateApp'
import * as PackageJson from 'libs/packageJson'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const useGetMinimalBuildNumberSpy = jest.spyOn(useMinimalBuildNumber, 'useMinimalBuildNumber')

const buildVersion = 10304000
jest.spyOn(PackageJson, 'getAppBuildVersion').mockReturnValue(buildVersion)

describe('useMustUpdateApp', () => {
  it('should return false when the minimal build number is lower than local version', async () => {
    useGetMinimalBuildNumberSpy.mockReturnValueOnce({
      minimalBuildNumber: 10302000,
      isLoading: false,
    })

    const { result } = renderUseMustUpdateApp()

    await act(() => {
      expect(result.current).toEqual(mustUpdateAppState.SHOULD_NOT_UPDATE)
    })
  })

  it('should return true when the minimal build number is higher than local version', async () => {
    useGetMinimalBuildNumberSpy.mockReturnValueOnce({
      minimalBuildNumber: 10306000,
      isLoading: false,
    })

    const { result } = renderUseMustUpdateApp()

    await act(() => {
      expect(result.current).toEqual(mustUpdateAppState.SHOULD_UPDATE)
    })
  })
})

const renderUseMustUpdateApp = () =>
  renderHook(useMustUpdateApp, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
