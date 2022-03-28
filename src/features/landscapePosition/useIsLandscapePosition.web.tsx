import { useDimensions } from '@react-native-community/hooks'

// we are in a .web file
// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'

export const useIsLandscapePosition = (): boolean => {
  const { width: screenWidth, height: screenHeight } = useDimensions().screen

  if (isDesktopDeviceDetectOnWeb) return false
  return screenWidth > screenHeight
}
