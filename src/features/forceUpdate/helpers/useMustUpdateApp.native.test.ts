import * as useMinimalBuildNumber from 'features/forceUpdate/helpers/useMinimalBuildNumber'
import { MustUpdateAppState, useMustUpdateApp } from 'features/forceUpdate/helpers/useMustUpdateApp'
import * as PackageJson from 'libs/packageJson'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')

const useGetMinimalBuildNumberSpy = jest.spyOn(useMinimalBuildNumber, 'useMinimalBuildNumber')

const buildVersion = 10_304_000
jest.spyOn(PackageJson, 'getAppBuildVersion').mockReturnValue(buildVersion)

describe('useMustUpdateApp', () => {
  it('should not update when the minimal build number is lower than local version', async () => {
    useGetMinimalBuildNumberSpy.mockReturnValueOnce({
      minimalBuildNumber: 10_303_999,
      isLoading: false,
      error: null,
    })

    const { result } = renderUseMustUpdateApp()

    await act(() => {})

    expect(result.current).toEqual(MustUpdateAppState.SHOULD_NOT_UPDATE)
  })

  it('should update when the minimal build number is higher than local version', async () => {
    useGetMinimalBuildNumberSpy.mockReturnValueOnce({
      minimalBuildNumber: 10_304_001,
      isLoading: false,
      error: null,
    })

    const { result } = renderUseMustUpdateApp()

    await act(() => {})

    expect(result.current).toEqual(MustUpdateAppState.SHOULD_UPDATE)
  })

  it('should not update when the minimal build number is equal to the local version', async () => {
    useGetMinimalBuildNumberSpy.mockReturnValueOnce({
      minimalBuildNumber: buildVersion,
      isLoading: false,
      error: null,
    })

    const { result } = renderUseMustUpdateApp()

    await act(() => {})

    expect(result.current).toEqual(MustUpdateAppState.SHOULD_NOT_UPDATE)
  })
})

const renderUseMustUpdateApp = () =>
  renderHook(useMustUpdateApp, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
