import React from 'react'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

import { ColorScheme, colorSchemeActions, useColorScheme } from './useColorScheme'

type ThemeWrapperProps = {
  children: (colorScheme: ColorScheme) => React.ReactNode
}
const DISABLED_FF_COLOR_SCHEME = 'light'

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)
  colorSchemeActions.init()
  const systemColorScheme = useColorScheme()
  const colorScheme = enableDarkMode ? systemColorScheme : DISABLED_FF_COLOR_SCHEME

  return <React.Fragment>{children(colorScheme)}</React.Fragment>
}
