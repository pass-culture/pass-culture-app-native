import { useColorScheme as useSystemColorScheme } from 'react-native'

import { createStore } from 'libs/store/createStore'

import { getResolvedColorScheme } from './getResolvedColorScheme'
import { ColorScheme, ColorSchemeType } from './types'

export { ColorScheme } from './types'
export type { ColorSchemeType } from './types'
export { getResolvedColorScheme } from './getResolvedColorScheme'

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

export const useColorScheme = (): ColorSchemeType => {
  const storedScheme = useStoredColorScheme()
  const systemScheme = useSystemColorScheme()

  const userPreference = storedScheme ?? ColorScheme.SYSTEM

  return getResolvedColorScheme(userPreference, systemScheme)
}
