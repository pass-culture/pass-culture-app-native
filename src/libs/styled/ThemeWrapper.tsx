import React from 'react'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ThemeProvider } from 'libs/styled'
import { colorSchemeActions, useColorScheme } from 'libs/styled/useColorScheme'
import { theme } from 'theme'

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)
  colorSchemeActions.setEnableDarkMode(enableDarkMode)

  const colorScheme = useColorScheme()

  return (
    <ThemeProvider theme={theme} colorScheme={colorScheme}>
      {children}
    </ThemeProvider>
  )
}
