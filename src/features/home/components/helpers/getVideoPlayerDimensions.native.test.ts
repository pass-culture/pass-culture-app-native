import { getVideoPlayerDimensions } from 'features/home/components/helpers/getVideoPlayerDimensions'

const mobileWidthMock = 390
const desktopWidthMock = 1512

describe('getVideoPlayerDimensions', () => {
  it('should return a width and heigth for mobile view', () => {
    const isDesktopViewport = false
    const windowWidth = mobileWidthMock

    const dimensions = getVideoPlayerDimensions(isDesktopViewport, windowWidth)

    expect(dimensions).toEqual({ playerHeight: 219.375, playerWidth: 390 })
  })

  it('should return a width and heigth for desktop view', () => {
    const isDesktopViewport = true
    const windowWidth = desktopWidthMock

    const dimensions = getVideoPlayerDimensions(isDesktopViewport, windowWidth)

    expect(dimensions).toEqual({ playerHeight: 292.5, playerWidth: 520 })
  })
})
