import { useEffect } from 'react'
import { useColorScheme as useSystemColorScheme } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { createStore } from 'libs/store/createStore'

export enum ColorScheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export type ColorSchemeType = ColorScheme.LIGHT | ColorScheme.DARK | undefined

type State = { colorScheme: ColorScheme | undefined }

const defaultState: State = { colorScheme: undefined }

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
      (state): ColorScheme | undefined =>
        state.colorScheme,
  },
  options: { persist: true },
})

export const colorSchemeActions = colorSchemeStore.actions
export const useStoredColorScheme: () => ColorScheme | undefined =
  colorSchemeStore.hooks.useColorScheme

export const useColorScheme = (): ColorSchemeType => {
  const storedScheme = useStoredColorScheme()
  const systemScheme = useSystemColorScheme()
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)
  const { setColorScheme } = colorSchemeActions

  useEffect(() => {
    if (enableDarkMode && storedScheme === undefined) {
      setColorScheme({ colorScheme: ColorScheme.SYSTEM })
    }
  }, [enableDarkMode, storedScheme, setColorScheme])

  if (!enableDarkMode) {
    return ColorScheme.LIGHT
  }

  const effectiveScheme = storedScheme ?? ColorScheme.SYSTEM
  if (effectiveScheme === ColorScheme.SYSTEM) {
    return systemScheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT
  }

  return effectiveScheme
}
