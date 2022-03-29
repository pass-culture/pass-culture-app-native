import React, { useEffect } from 'react'

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { ThemeProvider } from 'libs/styled'
import { SafeAreaProvider } from 'libs/react-native-save-area-provider'
import { theme } from 'theme'
import { activate } from 'libs/i18n'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
  (Story) => (
    <SafeAreaProvider>
      <Story />
    </SafeAreaProvider>
  ),
  (Story) => {
    useEffect(() => {
      activate('fr')
    }, [])
    return (
      <I18nProvider i18n={i18n}>
        <Story />
      </I18nProvider>
    )
  },
]
