import { theme } from 'theme'

import { getMediaQueryFromDimensions } from '../useMediaQuery'

describe('useMediaQuery native', () => {
  let isMobile = false
  let isTablet = false
  let isDesktop = false
  const windowHeight = 1024

  describe('isMobile/isTablet/isDesktop media queries', () => {
    it('should return isMobile to true when windowWidth < theme.breakpoints.md', () => {
      const dimensions = { windowWidth: theme.breakpoints.md - 1, windowHeight }

      isMobile = !!getMediaQueryFromDimensions({ ...dimensions, maxWidth: theme.breakpoints.md })
      isTablet = !!getMediaQueryFromDimensions({
        ...dimensions,
        minWidth: theme.breakpoints.md,
        maxWidth: theme.breakpoints.lg,
      })
      isDesktop = !!getMediaQueryFromDimensions({ ...dimensions, minWidth: theme.breakpoints.lg })

      expect(isMobile).toBeTruthy()
      expect(isTablet).toBeFalsy()
      expect(isDesktop).toBeFalsy()
    })

    it('should return isTablet to true when windowWidth > theme.breakpoints.md and windowWidth < theme.breakpoints.lg', () => {
      const dimensions = { windowWidth: theme.breakpoints.md + 1, windowHeight }

      isMobile = !!getMediaQueryFromDimensions({ ...dimensions, maxWidth: theme.breakpoints.md })
      isTablet = !!getMediaQueryFromDimensions({
        ...dimensions,
        minWidth: theme.breakpoints.md,
        maxWidth: theme.breakpoints.lg,
      })
      isDesktop = !!getMediaQueryFromDimensions({ ...dimensions, minWidth: theme.breakpoints.lg })

      expect(isMobile).toBeFalsy()
      expect(isTablet).toBeTruthy()
      expect(isDesktop).toBeFalsy()
    })

    it('should return isDesktop to true when windowWidth > theme.breakpoints.lg', () => {
      const dimensions = { windowWidth: theme.breakpoints.lg + 1, windowHeight }

      isMobile = !!getMediaQueryFromDimensions({ ...dimensions, maxWidth: theme.breakpoints.md })
      isTablet = !!getMediaQueryFromDimensions({
        ...dimensions,
        minWidth: theme.breakpoints.md,
        maxWidth: theme.breakpoints.lg,
      })
      isDesktop = !!getMediaQueryFromDimensions({ ...dimensions, minWidth: theme.breakpoints.lg })

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
        const dimensions = { windowWidth: 1000, windowHeight: 500 }
        const isMq = !!getMediaQueryFromDimensions({
          ...dimensions,
          minWidth,
          maxWidth,
          minHeight,
          maxHeight,
        })
        expect(isMq).toBe(mq)
      }
    )
  })
})
