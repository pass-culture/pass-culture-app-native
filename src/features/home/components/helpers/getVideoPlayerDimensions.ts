import { PixelRatio } from 'react-native'

// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'

export const RATIO169 = 9 / 16
export const RATIO710 = 10 / 7

export const getVideoPlayerDimensions = (
  isDesktopViewport: boolean | undefined,
  windowWidth: number,
  ratio: number
) => {
  const playerHeight =
    ((isDesktopViewport
      ? Math.min(windowWidth, theme.modal.desktopMaxWidth) * PixelRatio.get()
      : windowWidth * PixelRatio.get()) *
      ratio) /
    PixelRatio.get()

  const playerWidth = isDesktopViewport
    ? Math.min(windowWidth, theme.modal.desktopMaxWidth)
    : windowWidth

  return { playerHeight, playerWidth }
}
