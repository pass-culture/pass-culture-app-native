import { PixelRatio } from 'react-native'

export const RATIO169 = 9 / 16
export const RATIO710 = 10 / 7

export const getVideoPlayerDimensions = ({
  isDesktopViewport,
  windowWidth,
  ratio,
  desktopMaxWidth,
}: {
  isDesktopViewport: boolean | undefined
  windowWidth: number
  ratio: number
  desktopMaxWidth: number
}) => {
  const playerHeight =
    ((isDesktopViewport
      ? Math.min(windowWidth, desktopMaxWidth) * PixelRatio.get()
      : windowWidth * PixelRatio.get()) *
      ratio) /
    PixelRatio.get()

  const playerWidth = isDesktopViewport ? Math.min(windowWidth, desktopMaxWidth) : windowWidth

  return { playerHeight, playerWidth }
}
