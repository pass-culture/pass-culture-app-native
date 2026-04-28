import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme as useSystemColorScheme } from 'react-native'

import { createStore } from 'libs/store/createStore'

import { getResolvedColorScheme } from './getResolvedColorScheme'
import { ColorScheme, ColorSchemeType } from './types'

export { ColorScheme } from './types'
export type { ColorSchemeType } from './types'
export { getResolvedColorScheme } from './getResolvedColorScheme'

type State = { colorScheme: ColorScheme }

const COLOR_SCHEME_STORAGE_KEY = 'colorScheme'

const defaultState: State = { colorScheme: ColorScheme.SYSTEM }

const colorSchemeStore = createStore({
  name: COLOR_SCHEME_STORAGE_KEY,
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

const parseStoredColorScheme = (storedValue: string | null): ColorScheme | null => {
  if (!storedValue) return null
  try {
    const parsed = JSON.parse(storedValue) as { state?: { colorScheme?: ColorScheme } }
    const scheme = parsed?.state?.colorScheme
    if (
      scheme === ColorScheme.LIGHT ||
      scheme === ColorScheme.DARK ||
      scheme === ColorScheme.SYSTEM
    ) {
      return scheme
    }
  } catch {
    return null
  }
  return null
}

// Reads the color scheme directly from AsyncStorage to avoid the Zustand
// hydration race: on app launch, the store still holds defaultState until the
// async hydration completes, so subscribers see the wrong value transiently.
export const getPersistedColorScheme = async (): Promise<ColorScheme> => {
  const storedValue = await AsyncStorage.getItem(COLOR_SCHEME_STORAGE_KEY)
  return parseStoredColorScheme(storedValue) ?? ColorScheme.SYSTEM
}

export const colorSchemeActions = colorSchemeStore.actions
export const useStoredColorScheme: () => ColorScheme = colorSchemeStore.hooks.useColorScheme

export const useColorScheme = (): ColorSchemeType => {
  const storedScheme = useStoredColorScheme()
  const systemScheme = useSystemColorScheme()

  const userPreference = storedScheme ?? ColorScheme.SYSTEM

  return getResolvedColorScheme(userPreference, systemScheme)
}
