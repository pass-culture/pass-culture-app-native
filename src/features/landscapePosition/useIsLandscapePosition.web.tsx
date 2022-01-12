import { useWindowDimensions } from 'react-native'

// we are in a .web file
// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'

// is usefull to avoid detecting landscape mode while keyboard is open on portrait mode
const landscapeModeMargin = 30

export const useIsLandscapePosition = (): boolean => {
  const { width, height } = useWindowDimensions()
  if (isDesktopDeviceDetectOnWeb) return false
  return width > height + landscapeModeMargin
}
