import { useColorScheme as useSystemColorScheme } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { createStore } from 'libs/store/createStore'

export enum ColorScheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export type ColorSchemeType = ColorScheme.LIGHT | ColorScheme.DARK

const colorSchemeStore = createStore({
  name: 'colorScheme',
  defaultState: { colorScheme: ColorScheme.LIGHT },
  actions: (set) => ({
    setColorScheme: ({ colorScheme }: { colorScheme: ColorScheme }) => {
      set({ colorScheme })
    },
  }),
  selectors: {
    selectColorScheme:
      () =>
      (state): ColorScheme =>
        state.colorScheme,
  },
  options: { persist: true },
})

export const colorSchemeActions = colorSchemeStore.actions
export const useStoredColorScheme: () => ColorScheme = colorSchemeStore.hooks.useColorScheme

export const useColorScheme = (): ColorSchemeType => {
  const storedScheme = useStoredColorScheme()
  const systemScheme = useSystemColorScheme()
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)

  if (!enableDarkMode) {
    return ColorScheme.LIGHT
  }

  if (storedScheme === ColorScheme.SYSTEM) {
    return systemScheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT
  }

  return storedScheme
}
