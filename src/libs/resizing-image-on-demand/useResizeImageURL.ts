import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

const MOBILE_MAX_SIZE = 327
const DESKTOP_MAX_SIZE = 432

export const useResizeImageURL = (imageURL: string) => {
  const { isDesktopViewport } = useTheme()
  const { scale: pixelRatio } = useWindowDimensions()

  const imageMaxSize = isDesktopViewport ? DESKTOP_MAX_SIZE : MOBILE_MAX_SIZE

  const size = imageMaxSize * pixelRatio

  return imageURL.replace(
    'https://storage.googleapis.com/passculture-metier-ehp-testing-assets',
    `https://image-resizing-dot-passculture-metier-ehp.ew.r.appspot.com/?size=${size}&filename=passculture-metier-ehp-testing-assets-fine-grained`
  )
}
