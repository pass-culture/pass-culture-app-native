import * as useMinimalBuildNumberModule from 'features/forceUpdate/helpers/useMinimalBuildNumber'
import * as packageJson from 'libs/packageJson'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

import { useResetOnMinimalBuild } from './useResetOnMinimalBuild'

describe('useResetOnMinimalBuild', () => {
  let mockResetErrorBoundary: jest.Mock

  beforeEach(() => {
    mockResetErrorBoundary = jest.fn()
    jest.spyOn(useMinimalBuildNumberModule, 'useMinimalBuildNumber')
    jest.spyOn(packageJson, 'getAppBuildVersion')
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  const renderHookWithProvider = (hook: () => void) =>
    renderHook(hook, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

  it('should call resetErrorBoundary on component unmount', () => {
    const { unmount } = renderHookWithProvider(() => useResetOnMinimalBuild(mockResetErrorBoundary))
    unmount()

    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1)
  })

  it('should not call resetErrorBoundary if minimalBuildNumber is null', () => {
    jest.spyOn(useMinimalBuildNumberModule, 'useMinimalBuildNumber').mockReturnValueOnce({
      minimalBuildNumber: undefined,
      isLoading: false,
      error: null,
    })
    jest.spyOn(packageJson, 'getAppBuildVersion').mockReturnValueOnce(123)

    renderHookWithProvider(() => useResetOnMinimalBuild(mockResetErrorBoundary))

    expect(mockResetErrorBoundary).not.toHaveBeenCalled()
  })

  it('should not call resetErrorBoundary if minimalBuildNumber is greater than app build version', () => {
    jest.spyOn(useMinimalBuildNumberModule, 'useMinimalBuildNumber').mockReturnValueOnce({
      minimalBuildNumber: 200,
      isLoading: false,
      error: null,
    })
    jest.spyOn(packageJson, 'getAppBuildVersion').mockReturnValueOnce(123)

    renderHookWithProvider(() => useResetOnMinimalBuild(mockResetErrorBoundary))

    expect(mockResetErrorBoundary).not.toHaveBeenCalled()
  })

  it('should call resetErrorBoundary if minimalBuildNumber is less than or equal to app build version', () => {
    jest.spyOn(useMinimalBuildNumberModule, 'useMinimalBuildNumber').mockReturnValueOnce({
      minimalBuildNumber: 100,
      isLoading: false,
      error: null,
    })
    jest.spyOn(packageJson, 'getAppBuildVersion').mockReturnValueOnce(123)

    renderHookWithProvider(() => useResetOnMinimalBuild(mockResetErrorBoundary))

    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1)
  })
})
