import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { env } from 'libs/environment/env'
import { useEnableFrontImageResizing, useObjectStorageUrl } from 'queries/settings/useSettings'

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
  const { data: objectStorageUrl } = useObjectStorageUrl()

  if (!enableFrontImageResizing || !objectStorageUrl) {
    return imageURL
  }

  const imageMaxSize = isDesktopViewport ? DESKTOP_MAX_SIZE : MOBILE_MAX_SIZE
  const customSize = height && width && Math.max(height, width)
  const sizeWithRatio = (customSize ?? imageMaxSize) * pixelRatio

  return imageURL.replace(
    objectStorageUrl,
    `${env.RESIZE_IMAGE_ON_DEMAND_URL}/?size=${sizeWithRatio}&filename=${env.GCP_IMAGE_COULD_STORAGE_NAME}`
  )
}
