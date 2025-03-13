import React from 'react'
import { useColorScheme, ColorSchemeName } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

type ThemeWrapperProps = {
  children: (colorScheme: ColorSchemeName) => React.ReactNode
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)
  const systemColorScheme = useColorScheme()
  const colorScheme = enableDarkMode ? systemColorScheme ?? 'light' : 'light'

  return <React.Fragment>{children(colorScheme)}</React.Fragment>
}
