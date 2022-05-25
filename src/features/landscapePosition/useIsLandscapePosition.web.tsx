/* eslint-disable no-restricted-imports */
import { useDimensions } from '@react-native-community/hooks'
import { isIOS } from 'react-device-detect'

import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'

export const useIsLandscapePosition = (): boolean => {
  const { window, screen } = useDimensions()

  if (isDesktopDeviceDetectOnWeb) return false

  let width = screen.width
  let height = screen.height
  if (isIOS) {
    width = window.width
    height = window.height
  }
  return width > height
}
