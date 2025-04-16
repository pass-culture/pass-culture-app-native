import React from 'react'
import { ColorSchemeName } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

import { useColorScheme } from './useColorScheme'

type ThemeWrapperProps = {
  children: (colorScheme: ColorSchemeName) => React.ReactNode
}
const DISABLED_FF_COLOR_SCHEME = 'light'

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)
  const systemColorScheme = useColorScheme()
  const colorScheme = enableDarkMode ? systemColorScheme : DISABLED_FF_COLOR_SCHEME

  return <React.Fragment>{children(colorScheme)}</React.Fragment>
}
