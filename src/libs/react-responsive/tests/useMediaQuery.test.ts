import { renderHook } from '@testing-library/react-hooks'
import * as RN from 'react-native'

import { theme } from 'theme'

import { useMediaQuery } from '../useMediaQuery'

describe('useMediaQuery native', () => {
  let isMobile = false
  let isTablet = false
  let isDesktop = false
  const height = 1024
  const scale = 1
  const fontScale = 1
  const mySpy = jest.spyOn(RN, 'useWindowDimensions')
  afterEach(jest.clearAllMocks)

  it('should return isMobile to true when windowWidth < theme.breakpoints.md', () => {
    const windowDimensions = {
      width: theme.breakpoints.md - 1,
      height,
      scale,
      fontScale,
    }

    mySpy.mockReturnValueOnce(windowDimensions)
    isMobile = renderHook(() => useMediaQuery({ maxWidth: theme.breakpoints.md })).result.current

    mySpy.mockReturnValueOnce(windowDimensions)
    isTablet = renderHook(() =>
      useMediaQuery({ minWidth: theme.breakpoints.md, maxWidth: theme.breakpoints.lg })
    ).result.current

    mySpy.mockReturnValueOnce(windowDimensions)
    isDesktop = renderHook(() => useMediaQuery({ minWidth: theme.breakpoints.lg })).result.current
    expect(isMobile).toBeTruthy()
    expect(isTablet).toBeFalsy()
    expect(isDesktop).toBeFalsy()
  })

  it('should return isTablet to true when windowWidth > theme.breakpoints.md and windowWidth < theme.breakpoints.lg', () => {
    const windowDimensions = {
      width: theme.breakpoints.md + 1,
      height,
      scale,
      fontScale,
    }

    mySpy.mockReturnValueOnce(windowDimensions)
    isMobile = renderHook(() => useMediaQuery({ maxWidth: theme.breakpoints.md })).result.current

    mySpy.mockReturnValueOnce(windowDimensions)
    isTablet = renderHook(() =>
      useMediaQuery({ minWidth: theme.breakpoints.md, maxWidth: theme.breakpoints.lg })
    ).result.current

    mySpy.mockReturnValueOnce(windowDimensions)
    isDesktop = renderHook(() => useMediaQuery({ minWidth: theme.breakpoints.lg })).result.current

    expect(isMobile).toBeFalsy()
    expect(isTablet).toBeTruthy()
    expect(isDesktop).toBeFalsy()
  })

  it('should return isDesktop to true when windowWidth > theme.breakpoints.lg', () => {
    const windowDimensions = {
      width: theme.breakpoints.lg + 1,
      height,
      scale,
      fontScale,
    }

    mySpy.mockReturnValueOnce(windowDimensions)
    isMobile = renderHook(() => useMediaQuery({ maxWidth: theme.breakpoints.md })).result.current

    mySpy.mockReturnValueOnce(windowDimensions)
    isTablet = renderHook(() =>
      useMediaQuery({ minWidth: theme.breakpoints.md, maxWidth: theme.breakpoints.lg })
    ).result.current

    mySpy.mockReturnValueOnce(windowDimensions)
    isDesktop = renderHook(() => useMediaQuery({ minWidth: theme.breakpoints.lg })).result.current
    expect(isMobile).toBeFalsy()
    expect(isTablet).toBeFalsy()
    expect(isDesktop).toBeTruthy()
  })
})
