import { PixelRatio } from 'react-native'

import { theme } from 'theme'

export const getVideoPlayerDimensions = (
  isDesktopViewport: boolean | undefined,
  windowWidth: number
) => {
  const playerHeight = Math.ceil(
    ((isDesktopViewport
      ? Math.min(windowWidth, theme.modal.desktopMaxWidth) * PixelRatio.get()
      : windowWidth * PixelRatio.get()) *
      (9 / 16)) /
      PixelRatio.get()
  )
  const playerWidth = isDesktopViewport
    ? Math.min(windowWidth, theme.modal.desktopMaxWidth)
    : windowWidth

  return { playerHeight, playerWidth }
}
