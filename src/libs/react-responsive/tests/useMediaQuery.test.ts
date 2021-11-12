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

  describe('isMobile/isTablet/isDesktop media queries', () => {
    it('should return isMobile to true when windowWidth < theme.breakpoints.md', () => {
      const windowDimensions = {
        width: theme.breakpoints.md - 1,
        height,
        scale,
        fontScale,
      }

      mySpy.mockReturnValueOnce(windowDimensions)
      isMobile = !!renderHook(() => useMediaQuery({ maxWidth: theme.breakpoints.md })).result
        .current

      mySpy.mockReturnValueOnce(windowDimensions)
      isTablet = !!renderHook(() =>
        useMediaQuery({ minWidth: theme.breakpoints.md, maxWidth: theme.breakpoints.lg })
      ).result.current

      mySpy.mockReturnValueOnce(windowDimensions)
      isDesktop = !!renderHook(() => useMediaQuery({ minWidth: theme.breakpoints.lg })).result
        .current
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
      isMobile = !!renderHook(() => useMediaQuery({ maxWidth: theme.breakpoints.md })).result
        .current

      mySpy.mockReturnValueOnce(windowDimensions)
      isTablet = !!renderHook(() =>
        useMediaQuery({ minWidth: theme.breakpoints.md, maxWidth: theme.breakpoints.lg })
      ).result.current

      mySpy.mockReturnValueOnce(windowDimensions)
      isDesktop = !!renderHook(() => useMediaQuery({ minWidth: theme.breakpoints.lg })).result
        .current

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
      isMobile = !!renderHook(() => useMediaQuery({ maxWidth: theme.breakpoints.md })).result
        .current

      mySpy.mockReturnValueOnce(windowDimensions)
      isTablet = !!renderHook(() =>
        useMediaQuery({ minWidth: theme.breakpoints.md, maxWidth: theme.breakpoints.lg })
      ).result.current

      mySpy.mockReturnValueOnce(windowDimensions)
      isDesktop = !!renderHook(() => useMediaQuery({ minWidth: theme.breakpoints.lg })).result
        .current
      expect(isMobile).toBeFalsy()
      expect(isTablet).toBeFalsy()
      expect(isDesktop).toBeTruthy()
    })
  })

  describe('useMediaQuery', () => {
    it.each`
      minWidth     | maxWidth     | minHeight    | maxHeight    | mq
      ${0}         | ${400}       | ${undefined} | ${undefined} | ${false}
      ${0}         | ${500}       | ${undefined} | ${undefined} | ${false}
      ${500}       | ${1000}      | ${undefined} | ${undefined} | ${true}
      ${501}       | ${1200}      | ${600}       | ${undefined} | ${true}
      ${501}       | ${1200}      | ${undefined} | ${1000}      | ${true}
      ${501}       | ${1200}      | ${undefined} | ${500}       | ${true}
      ${501}       | ${1200}      | ${500}       | ${undefined} | ${true}
      ${undefined} | ${undefined} | ${500}       | ${undefined} | ${true}
      ${undefined} | ${500}       | ${undefined} | ${undefined} | ${false}
      ${undefined} | ${500}       | ${500}       | ${undefined} | ${false}
      ${undefined} | ${500}       | ${499}       | ${undefined} | ${false}
      ${undefined} | ${1000}      | ${500}       | ${1001}      | ${true}
      ${undefined} | ${1000}      | ${undefined} | ${1001}      | ${true}
      ${undefined} | ${1000}      | ${undefined} | ${1000}      | ${true}
      ${undefined} | ${undefined} | ${500}       | ${500}       | ${true}
      ${undefined} | ${undefined} | ${500}       | ${undefined} | ${true}
      ${undefined} | ${undefined} | ${499}       | ${undefined} | ${true}
      ${2000}      | ${2000}      | ${600}       | ${600}       | ${false}
      ${1000}      | ${2000}      | ${600}       | ${600}       | ${false}
      ${1000}      | ${2000}      | ${500}       | ${600}       | ${true}
      ${1000}      | ${2000}      | ${undefined} | ${500}       | ${true}
    `(
      'should return $mq when minWidth=$minWidth, maxWidth=$maxWidth, minHeight=$minHeight and maxHeight=$maxHeight',
      async ({
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        mq,
      }: {
        minWidth: number
        maxWidth: number
        minHeight: number
        maxHeight: number
        mq: boolean
      }) => {
        let isMq = false
        const windowDimensions = {
          width: 1000,
          height: 500,
          scale: 1,
          fontScale: 1,
        }
        mySpy.mockReturnValueOnce(windowDimensions)
        isMq = !!renderHook(() =>
          useMediaQuery({
            minWidth,
            maxWidth,
            minHeight,
            maxHeight,
          })
        ).result.current
        expect(isMq).toBe(mq)
      }
    )
  })
})
