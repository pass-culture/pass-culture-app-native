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

type State = { colorScheme: ColorScheme }

const defaultState: State = { colorScheme: ColorScheme.SYSTEM }

const colorSchemeStore = createStore({
  name: 'colorScheme',
  defaultState,
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

export const getResolvedColorScheme = (
  storedScheme: ColorScheme,
  systemScheme: 'light' | 'dark' | null | undefined
): ColorSchemeType => {
  if (storedScheme === ColorScheme.LIGHT || storedScheme === ColorScheme.DARK) {
    return storedScheme
  }
  return systemScheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT
}

export const useColorScheme = (): ColorSchemeType => {
  const storedScheme = useStoredColorScheme()
  const systemScheme = useSystemColorScheme()
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)

  if (!enableDarkMode) {
    return ColorScheme.LIGHT
  }

  const userPreference = storedScheme ?? ColorScheme.SYSTEM

  return getResolvedColorScheme(userPreference, systemScheme)
}
