import { useWindowDimensions } from 'react-native'

// we are in a .web file
// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'

export const useIsLandscapePosition = (): boolean => {
  const { width, height } = useWindowDimensions()
  if (isDesktopDeviceDetectOnWeb) return false
  return width >= height
}
