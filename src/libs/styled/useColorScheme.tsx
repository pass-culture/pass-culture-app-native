import { useColorScheme as useSystemColorScheme } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { createStore } from 'libs/store/createStore'

export enum ColorSchemeEnum {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export type ColorScheme = ColorSchemeEnum.LIGHT | ColorSchemeEnum.DARK
export type ColorSchemeFull = ColorSchemeEnum

type State = { colorScheme: ColorSchemeFull }

const DEFAULT_COLOR_SCHEME: ColorSchemeFull = ColorSchemeEnum.LIGHT
const defaultState: State = { colorScheme: DEFAULT_COLOR_SCHEME }

const colorSchemeStore = createStore({
  name: 'colorScheme',
  defaultState,
  actions: (set) => ({
    setColorScheme: ({ colorScheme }: { colorScheme: ColorSchemeFull }) => {
      set({ colorScheme })
    },
  }),
  selectors: {
    selectColorScheme:
      () =>
      (state): ColorSchemeFull =>
        state.colorScheme,
  },
  options: { persist: true },
})

export const colorSchemeActions = colorSchemeStore.actions
export const useStoredColorScheme: () => ColorSchemeFull = colorSchemeStore.hooks.useColorScheme

export const useColorScheme = (): ColorScheme => {
  const storedScheme = useStoredColorScheme()
  const systemScheme = useSystemColorScheme()
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)

  if (!enableDarkMode) {
    return ColorSchemeEnum.LIGHT
  }

  if (storedScheme === ColorSchemeEnum.SYSTEM) {
    return systemScheme === 'dark' ? ColorSchemeEnum.DARK : ColorSchemeEnum.LIGHT
  }

  return storedScheme
}
