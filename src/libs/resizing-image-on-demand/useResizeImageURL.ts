import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { env } from 'libs/environment'

const MOBILE_MAX_SIZE = 327
const DESKTOP_MAX_SIZE = 432

export const useResizeImageURL = (imageURL: string) => {
  const { isDesktopViewport } = useTheme()
  const { scale: pixelRatio } = useWindowDimensions()

  const { data: appSettings } = useAppSettings()
  if (!appSettings?.enableFrontImageResizing) {
    return imageURL
  }

  const imageMaxSize = isDesktopViewport ? DESKTOP_MAX_SIZE : MOBILE_MAX_SIZE

  const size = imageMaxSize * pixelRatio

  return imageURL.replace(
    appSettings.objectStorageUrl,
    `${env.RESIZE_IMAGE_ON_DEMAND_URL}/?size=${size}&filename=${env.GCP_IMAGE_COULD_STORAGE_NAME}`
  )
}
