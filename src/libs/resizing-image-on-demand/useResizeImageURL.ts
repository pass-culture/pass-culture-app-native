import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { env } from 'libs/environment/env'
import {
  useEnableFrontImageResizing,
  useImageResizingUrl,
  useImgProxyFormat,
} from 'queries/settings/useSettings'

const MOBILE_MAX_SIZE = 327
const DESKTOP_MAX_SIZE = 432

type Params = {
  imageURL: string
  height?: number
  width?: number
}

export const useResizeImageURL = ({ imageURL, height, width }: Params) => {
  const { isDesktopViewport } = useTheme()
  const { scale: pixelRatio } = useWindowDimensions()

  const { data: enableFrontImageResizing } = useEnableFrontImageResizing()
  const { data: imageResizingUrl } = useImageResizingUrl()
  const { data: shouldUseImgProxyFormat } = useImgProxyFormat()

  if (!enableFrontImageResizing) {
    return imageURL
  }

  const imageMaxSize = isDesktopViewport ? DESKTOP_MAX_SIZE : MOBILE_MAX_SIZE
  const customSize = height && width && Math.max(height, width)
  const sizeWithRatio = (customSize ?? imageMaxSize) * pixelRatio
  const imageResizingHost = imageResizingUrl ?? env.RESIZE_IMAGE_ON_DEMAND_URL
  try {
    const parsedImageURL = new URL(imageURL)
    if (parsedImageURL.hostname != 'storage.googleapis.com') {
      return imageURL
    }
    const trimmedPathName = parsedImageURL.pathname.replace(/^\//, '')
    const resizedImageURL = shouldUseImgProxyFormat
      ? new URL(
          `/insecure/rs:fit:${sizeWithRatio}:${sizeWithRatio}/plain/gs://${trimmedPathName}`,
          imageResizingHost
        )
      : new URL(`?size=${sizeWithRatio}&filename=${trimmedPathName}`, imageResizingHost)
    return resizedImageURL.href
  } catch {
    return imageURL
  }
}
